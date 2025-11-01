// components/taskColumn.tsx
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useDroppable} from "@dnd-kit/core";
import { X } from 'lucide-react';
import {JobInterface} from "@/types/jobs";
import {ColumnInterface} from "@/types/columnInterface";
import axios from "axios";

export function Task({ id, title, company, logo, bgColor, salary, description, tags }: JobInterface) {
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

    async function deleteJob(jobId: string) {
        console.log(jobId);
        try {
            await axios.delete('/api/jobs/delete', {
                data: { id: jobId }
            });
            // TODO: Update UI after deletion
        } catch (err: any) {
            console.error('Failed to delete job:', err);
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white p-3 rounded-[4px] mb-2 hover:shadow-sm transition-shadow border border-gray-100"
        >
            <div className="flex items-start gap-2 mb-2">
                {/* Drag Handle - Only this area triggers dragging */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <div
                        className="w-10 h-10 rounded-[4px] flex items-center justify-center flex-shrink-0 bg-gray-200 overflow-hidden"
                        style={{ backgroundColor: 'red' }}
                    >
                        {logo ? (
                            <img
                                src={logo}
                                alt="logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-semibold text-sm">N/A</span>
                        )}
                    </div>
                </div>

                {/* Company Name & Menu */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">{company}</span>
                        <button
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this job?')) {
                                    deleteJob(id);
                                }
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Rest of the content remains the same */}
            <h3 className="font-bold text-gray-900 text-sm mb-1">
                {title}
            </h3>

            {salary && (
                <p className="text-xs text-gray-600 mb-2">{salary}</p>
            )}

            {description && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
            )}

            {tags && tags.length > 0 && (
                <div className="flex gap-1 mb-2 flex-wrap">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-sm font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
export function Column({ id, title, tasks, icon: Icon }:ColumnInterface) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const taskIds = tasks.map((task) => task.id);

    return (
        <div className="rounded-[4px] p-3 flex-1 min-w-0 border border-gray-200" style={{backgroundColor:"#F2F2F2"}}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-600" />}
                    <h2 className="font-semibold text-xs text-gray-700">
                        {title} <span className="text-gray-500">{tasks.length}</span>
                    </h2>
                </div>

            </div>

            <div
                ref={setNodeRef}
                className={`min-h-[400px] rounded-[4px] transition-colors ${
                    isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed p-2' : ''
                }`}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    <div className='mt-6'>
                        {tasks.map((task) => (
                            <Task
                                status={task.status}
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                company={task.company}
                                logo={task.logo}
                                bgColor={task.bgColor}
                                salary={task.salary}
                                description={task.description}
                                tags={task.tags}
                            />
                        ))}
                        {tasks.length === 0 && (
                            <div className="text-gray-400 text-center py-12 text-xs">
                                Drop jobs here
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
