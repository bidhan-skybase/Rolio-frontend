// components/taskColumn.tsx
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import {useDroppable} from "@dnd-kit/core";
import { X, MoreHorizontal, Bookmark } from 'lucide-react';

export function Task({ id, title, company, location, logo, bgColor, salary, description, tags, showInterview }) {
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
            className="bg-white p-3 rounded-[4px] mb-2 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow border border-gray-100"
        >
            <div className="flex items-start gap-2 mb-2">
                {/* Company Logo */}
                <div
                    className="w-10 h-10 rounded-[4px] flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                    style={{ backgroundColor: bgColor }}
                >
                    {logo}
                </div>

                {/* Company Name & Menu */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">{company}</span>
                        <button
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Job Title */}
            <h3 className="font-bold text-gray-900 text-sm mb-1 ">
                {title}
            </h3>

            {/* Salary */}
            {salary && (
                <p className="text-xs text-gray-600 mb-2">{salary}</p>
            )}

            {/* Description */}
            {description && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div className="flex gap-1 mb-2 flex-wrap">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-sm font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Interview Time */}
            {showInterview && (
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Today</span>
                    <span className="font-semibold">9:30 AM</span>
                    <button className="ml-auto text-gray-400 hover:text-gray-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Applied Date (for Applied Jobs) */}
            {!showInterview && tags && (
                <div className="flex items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <span>Applied today</span>
                </div>
            )}
        </div>
    );
}

export function Column({ id, title, tasks, icon: Icon }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const taskIds = tasks.map((task) => task.id);

    return (
        <div className="rounded-[4px] p-3 flex-1 min-w-0 border border-gray-200" style={{backgroundColor:"#F2F2F2"}}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-600" />}
                    <h2 className="font-semibold text-xs text-gray-700">
                        {title} <span className="text-gray-500">{tasks.length}</span>
                    </h2>
                </div>

            </div>

            {/* Droppable Area */}
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
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                company={task.company}
                                location={task.location}
                                logo={task.logo}
                                bgColor={task.bgColor}
                                salary={task.salary}
                                description={task.description}
                                tags={task.tags}
                                showInterview={task.showInterview}
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
