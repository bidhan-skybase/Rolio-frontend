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
import {JobInterface} from "@/types/jobs";
import {jobs} from "@/data";
import {Button} from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";


export default function JobBoard() {
    const [tasks, setTasks] = useState<JobInterface[]>(jobs);
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

    const getTasksByStatus = (status: string) => {
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
        const overColumn = Object.keys(columns).find((key) => key === overId);

        if (overColumn) {
            setTasks((tasks) => {
                return tasks.map((task) => {
                    if (task.id === activeId) {
                        return {...task, status: overColumn};
                    }
                    return task;
                });
            });
        } else if (overTask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (activeTask.status !== overTask.status) {
                setTasks((tasks) => {
                    return tasks.map((task) => {
                        if (task.id === activeId) {
                            return {...task, status: overTask.status};
                        }
                        return task;
                    });
                });
            } else {
                setTasks((tasks) => {
                    return arrayMove(tasks, activeIndex, overIndex);
                });
            }
        }
    };

    const handleDragEnd = () => {
        setActiveId(null);
    };

    return (
        <>
            <div className='pt-4 px-4 pb-4 flex flex-row justify-between'>
                <div>
                    <p className='text-2xl font-semibold'>Job Board</p>
                    <p className='text-[16px] font-medium text-gray-500'>Browse and apply to jobs</p>
                </div>


                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-[4px] bg-black text-white text-[14px] hover:bg-black/80">
                            Add Task
                        </Button>
                    </DialogTrigger> <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new job</DialogTitle>
                        <DialogDescription>
                            Be as specific as possible. Add job title, company info, and other details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label className='mb-2 text-xs font-medium text-muted-foreground'>Job title *</Label>
                        <Input placeholder='Title'></Input>
                    </div>
                    <div className='flex-row flex gap-2'>
                        <div className='flex-2'>
                            <Label className='mb-2 text-xs font-medium text-muted-foreground'>Company name *</Label>
                            <Input placeholder='Name'></Input>
                        </div>
                        <div className='flex-2'>
                            <Label className='mb-2 text-xs font-medium text-muted-foreground'>Logo Url</Label>
                            <Input placeholder='Url'></Input>
                        </div>
                    </div>
                    <div className='flex-row flex gap-2'>
                        <div className='flex-2'>
                            <Label className='mb-2 text-xs font-medium text-muted-foreground'>Expected salary</Label>
                            <Input placeholder='Salary'></Input>
                        </div>
                        <div className='flex-2'>
                            <Label className='mb-2 text-xs font-medium text-muted-foreground'>Tags</Label>
                            <Input placeholder='Tags'></Input>
                        </div>
                    </div>
                    <div>
                        <Label className='mb-2 text-xs font-medium text-muted-foreground'>Description</Label>
                        <Textarea placeholder="Type your description here." />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Job</Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>

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
                </DndContext>
            </main>
        </>
    );
}
