import {useState} from "react";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {Column} from "@/components/taskColumn";
import {Bookmark, CheckCircle, Calendar, XCircle, Gift} from 'lucide-react';
import {jobTasks} from "@/data";


export default function JobBoard() {
    const [tasks, setTasks] = useState(jobTasks);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    const columns = {
        saved: {id: 'saved', title: 'Saved Jobs', icon: Bookmark},
        applied: {id: 'applied', title: 'Applied Jobs', icon: CheckCircle},
        interviews: {id: 'interviews', title: 'Interviews', icon: Calendar},
        rejected: {id: 'rejected', title: 'Rejected Jobs', icon: XCircle},
        offered: {id: 'offered', title: 'Offered Jobs', icon: Gift},
    };

    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const {active, over} = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) return;

        // Check if we're dragging over a column or a task
        const overColumn = Object.keys(columns).find((key) => key === overId);

        if (overColumn) {
            // Dragging over a column
            setTasks((tasks) => {
                return tasks.map((task) => {
                    if (task.id === activeId) {
                        return {...task, status: overColumn};
                    }
                    return task;
                });
            });
        } else if (overTask) {
            // Dragging over a task
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (activeTask.status !== overTask.status) {
                // Moving to different column
                setTasks((tasks) => {
                    return tasks.map((task) => {
                        if (task.id === activeId) {
                            return {...task, status: overTask.status};
                        }
                        return task;
                    });
                });
            } else {
                // Reordering within same column
                setTasks((tasks) => {
                    return arrayMove(tasks, activeIndex, overIndex);
                });
            }
        }
    };

    const handleDragEnd = () => {
        setActiveId(null);
    };

    const activeTask = tasks.find((task) => task.id === activeId);

    return (
        <>
            <div className='pt-4 px-4 pb-4 flex flex-row justify-between'>
                <div>
                    <p className='text-2xl font-semibold'>Job Board</p>
                    <p className='text-[16px] font-medium text-gray-500'>Browse and apply to jobs</p>
                </div>

                <button className="btn shadow-none rounded-[4px]">Add Job</button>

            </div>
            <main className="flex-1 p-4 overflow-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-3 overflow-x-auto pb-4">
                        {Object.values(columns).map((column) => (
                            <Column
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                icon={column.icon}
                                tasks={getTasksByStatus(column.id)}
                            />
                        ))}
                    </div>
                    {/*    <DragOverlay>*/}
                    {/*        {activeTask ? (*/}
                    {/*            <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-400 cursor-grabbing">*/}
                    {/*                <h3 className="font-medium text-gray-900">{activeTask.title}</h3>*/}
                    {/*                <span className="text-xs text-gray-500 mt-2 inline-block">*/}
                    {/*  {activeTask.status}*/}
                    {/*</span>*/}
                    {/*            </div>*/}
                    {/*        ) : null}*/}
                    {/*    </DragOverlay>*/}
                </DndContext>
            </main>
        </>
    );
}
