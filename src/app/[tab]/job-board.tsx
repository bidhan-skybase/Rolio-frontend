/* eslint-disable @typescript-eslint/no-explicit-any */

import {useEffect, useState, useCallback} from "react";
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
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {X} from "lucide-react"
import axios from "axios";

const COLUMNS = {
    saved: { id: 'saved', title: 'Saved Jobs', icon: Bookmark },
    applied: { id: 'applied', title: 'Applied Jobs', icon: CheckCircle },
    interview: { id: 'interview', title: 'Interviews', icon: Calendar },
    rejected: { id: 'rejected', title: 'Rejected Jobs', icon: XCircle },
    offered: { id: 'offered', title: 'Offered Jobs', icon: Gift },
} as const;

interface FormData {
    title: string;
    companyName: string;
    logo: string;
    salary: string;
    tags: string[];
    description: string;
}

const initialFormData: FormData = {
    title: "",
    companyName: "",
    logo: "",
    salary: "",
    tags: [],
    description: ""
};

const TaskCard = ({ job }: { job: JobInterface }) => {
    return (
        <div
            style={{
                transform: "rotate(3deg) scale(1.05)",
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            }}
            className="p-3 bg-white rounded-lg cursor-grabbing"
        >
            <p className="font-bold text-sm">{job.title}</p>
            <p className="text-xs text-gray-500">{job.company}</p>
        </div>
    );
};


export default function JobBoard() {
    const [jobs, setJobs] = useState<JobInterface[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [open, setOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeJob = activeId
        ? jobs.find((job) => String(job.id) === String(activeId).replace("task-", ""))
        : null;

    useEffect(() => {
        const getJobLists = async () => {
            try {
                const res = await axios.get('/api/jobs/list');
                console.log("Job list:", res.data);
                setJobs(res.data);
            } catch (err) {
                console.error('Error fetching jobs list:', err);
            }
        };
        getJobLists();
    }, []);

    const createJob = async () => {
        if (!formData.title.trim() || !formData.companyName.trim()) {
            alert("Please fill in required fields (Title and Company Name)");
            return;
        }

        try {
            const newJob: Partial<JobInterface> = {
                title: formData.title.trim(),
                company: formData.companyName.trim(),
                logo: formData.logo || undefined,
                salary: formData.salary || undefined,
                description: formData.description || undefined,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
            };

            const res = await axios.post('/api/jobs/create', newJob);

            if (res.status === 200) {
                setJobs(prevJobs => [res.data, ...prevJobs]);
                setFormData(initialFormData);
                setInputValue("");
                setOpen(false);
            }
        } catch (err) {
            console.error('Error creating job:', err);
            alert("Failed to create job. Please try again.");
        }
    };

    const promptDeleteJob = useCallback((jobId: string) => {
        console.log(jobId);
        setJobToDelete(jobId);
        setShowDeleteDialog(true);
    }, []);

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;

        const originalJobs = [...jobs];
        setJobs(prevJobs => prevJobs.filter(job => String(job.id) !== jobToDelete));
        setShowDeleteDialog(false);

        try {
            await axios.delete("/api/jobs/delete", {
                data: { id: jobToDelete },
            });
        } catch (error) {
            console.error("Failed to delete job:", error);
            alert("Failed to delete job. Please try again.");
            setJobs(originalJobs);
        } finally {
            setJobToDelete(null);
        }
    };

    const getTasksByStatus = useCallback((status: string) => {
        return jobs.filter((task) => task.status === status);
    }, [jobs]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTaskId = String(activeId).replace("task-", "");
        const overTaskId = String(overId).replace("task-", "");

        const activeTask = jobs.find((t) => String(t.id) === activeTaskId);
        const overTask = jobs.find((t) => String(t.id) === overTaskId);

        if (!activeTask || !overTask || activeTask.status !== overTask.status) {
            return;
        }

        const activeIndex = jobs.findIndex((t) => String(t.id) === activeTaskId);
        const overIndex = jobs.findIndex((t) => String(t.id) === overTaskId);

        if (activeIndex !== overIndex) {
            setJobs((tasks) => arrayMove(tasks, activeIndex, overIndex));
        }
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const taskId = String(activeId).replace("task-", "");
        const job = jobs.find((j) => String(j.id) === taskId);

        if (!job) {
            return;
        }

        const oldStatus = job.status;
        let newStatus: string | undefined = oldStatus;

        const overIsColumn = Object.keys(COLUMNS).includes(overId);
        if (overIsColumn) {
            newStatus = overId;
        } else {
            const overTaskId = String(overId).replace("task-", "");
            const overTask = jobs.find((j) => String(j.id) === overTaskId);
            if (overTask) {
                newStatus = overTask.status;
            }
        }

        if (!newStatus || oldStatus === newStatus) {
            // If status hasn't changed, we might still need to handle reordering persistence if necessary.
            // For now, we only care about status changes.
            return;
        }

        // Optimistically update the UI
        setJobs((prevJobs) =>
            prevJobs.map((j) =>
                String(j.id) === taskId ? { ...j, status: newStatus } : j
            )
        );

        try {
            await axios.patch("/api/jobs/update", {
                job_id: Number(taskId),
                status_value: newStatus,
            });
        } catch (error: any) {
            // Revert on failure
            setJobs((prevJobs) =>
                prevJobs.map((j) =>
                    String(j.id) === taskId ? { ...j, status: oldStatus } : j
                )
            );
            console.error("Status update failed:", error);
            alert("Failed to update job status. Please try again.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!formData.tags.includes(inputValue.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, inputValue.trim()]
                }));
            }
            setInputValue("");
        } else if (e.key === "Backspace" && inputValue === "" && formData.tags.length > 0) {
            setFormData(prev => ({
                ...prev,
                tags: prev.tags.slice(0, -1)
            }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    return (
        <>
            <div className='pt-4 px-4 pb-4 flex flex-row justify-between'>
                <div>
                    <p className='text-2xl font-semibold'>Job Board</p>
                    <p className='text-[16px] font-medium text-gray-500'>Browse and apply to jobs</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-[4px] bg-black text-white text-[14px] hover:bg-black/80">
                            Add Job
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a new job</DialogTitle>
                            <DialogDescription>
                                Be as specific as possible. Add job title, company info, and other details below.
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label className='mb-2 text-xs font-medium text-muted-foreground'>Job title *</Label>
                            <Input
                                placeholder='Title'
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                            />
                        </div>
                        <div className='flex-row flex gap-2'>
                            <div className='flex-1'>
                                <Label className='mb-2 text-xs font-medium text-muted-foreground'>Company name *</Label>
                                <Input
                                    placeholder='Name'
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                                />
                            </div>
                            <div className='flex-1'>
                                <Label className='mb-2 text-xs font-medium text-muted-foreground'>Logo Url</Label>
                                <Input
                                    placeholder='Url'
                                    value={formData.logo}
                                    onChange={(e) => setFormData(prev => ({...prev, logo: e.target.value}))}
                                />
                            </div>
                        </div>
                        <div className='flex-row flex gap-2'>
                            <div className='flex-1'>
                                <Label className='mb-2 text-xs font-medium text-muted-foreground'>Expected salary</Label>
                                <Input
                                    placeholder='Salary'
                                    value={formData.salary}
                                    onChange={(e) => setFormData(prev => ({...prev, salary: e.target.value}))}
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <Label className="mb-2 text-xs font-medium text-muted-foreground">Tags</Label>
                                <div className="flex flex-wrap items-center gap-2 rounded-[4px] border border-input bg-background px-2 py-0">
                                    {formData.tags.map(tag => (
                                        <div
                                            key={tag}
                                            className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-foreground"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <Input
                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none flex-1 min-w-[80px]"
                                        placeholder="Tags"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label className='mb-2 text-xs font-medium text-muted-foreground'>Description</Label>
                            <Textarea
                                placeholder="Type your description here."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={createJob}>Add Job</Button>
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
                    <div className="flex gap-3 pb-4 overflow-hidden">
                        {Object.values(COLUMNS).map((column) => (
                            <Column
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                icon={column.icon}
                                tasks={getTasksByStatus(column.id)}
                                onDeleteJob={promptDeleteJob}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeJob ? <TaskCard job={activeJob} /> : null}
                    </DragOverlay>
                </DndContext>
            </main>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete this job
                            from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
