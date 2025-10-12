import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useDroppable} from "@dnd-kit/core";

export function Task({ id, title }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
            <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
    );
}

// Column Component with Droppable
export function Column({ id, title, tasks }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const taskIds = tasks.map((task) => task.id);

    return (
        <div className="bg-gray-50 rounded-lg p-4 min-w-[300px]">
            <h2 className="font-semibold text-lg mb-4 text-gray-700">{title}</h2>
            <div
                ref={setNodeRef}
                className={`min-h-[400px] rounded-lg transition-colors ${
                    isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
                }`}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <Task key={task.id} id={task.id} title={task.title} />
                        ))}
                        {tasks.length === 0 && (
                            <div className="text-gray-400 text-center py-8">
                                Drop tasks here
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
