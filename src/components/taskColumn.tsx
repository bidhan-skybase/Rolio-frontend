// components/taskColumn.tsx
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from "@dnd-kit/core";
import { X } from 'lucide-react';
import { JobInterface } from "@/types/jobs";
import { ColumnInterface } from "@/types/columnInterface";
import axios from "axios";
import { memo } from "react";

interface TaskProps extends JobInterface {
    onDelete: (jobId: string) => void; // ensure this matches Column's onDeleteJob
}

const Task = memo(({ id, title, company, logo, salary, description, tags, onDelete }: TaskProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `task-${id}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            await axios.delete('/api/jobs/delete', {
                data: { id: String(id) } // always send as string
            });
            onDelete(String(id)); // call callback with string
        } catch (err) {
            console.error('Failed to delete job:', err);
            alert('Failed to delete job. Please try again.');
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white p-3 rounded-[4px] mb-2 hover:shadow-sm transition-shadow border border-gray-100">
            <div className="flex items-start gap-2 mb-2">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <div className="w-10 h-10 rounded-[4px] flex items-center justify-center flex-shrink-0 bg-gray-200 overflow-hidden">
                        {logo ? (
                            <img src={logo} alt={`${company} logo`} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-semibold text-sm">{company.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 truncate">{company}</span>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" onClick={handleDelete} aria-label="Delete job">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{title}</h3>
            {salary && <p className="text-xs text-gray-600 mb-2">{salary}</p>}
            {description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>}
            {tags && tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                    {tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-sm font-medium">{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
});

Task.displayName = 'Task';

interface ColumnProps extends ColumnInterface {
    onDeleteJob: (jobId: string) => void; // ensure string
}

export const Column = memo(({ id, title, tasks, icon: Icon, onDeleteJob }: ColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    const taskIds = tasks.map((task) => `task-${task.id}`);

    return (
        <div ref={setNodeRef} className="rounded-[4px] p-2 flex-1 min-w-[280px] border border-gray-200" style={{ backgroundColor: "#F2F2F2" }}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-600" />}
                    <h2 className="font-semibold text-xs text-gray-700">{title} <span className="text-gray-500">({tasks.length})</span></h2>
                </div>
            </div>

            <div className={`min-h-[400px] rounded-[4px] transition-colors ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed p-2' : 'p-2'}`}>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div>
                        {tasks.map((task) => (
                            <Task
                                key={task.id}
                                {...task}
                                onDelete={onDeleteJob} // type-safe string
                            />
                        ))}
                        {tasks.length === 0 && (
                            <div className="text-gray-400 text-center py-12 text-xs">Drop jobs here</div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
});

Column.displayName = 'Column';

export { Task };
