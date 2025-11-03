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

export default function JobBoard() {
    const [jobs, setJobs] = useState<JobInterface[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [open, setOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const deleteJob = useCallback((jobId: number) => {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    }, []);

    const getTasksByStatus = useCallback((status: string) => {
        return jobs.filter((task) => task.status === status);
    }, [jobs]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: any) => {
        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Extract the numeric ID from task-X format
        const activeTaskId = activeId.replace("task-", "");
        const activeTask = jobs.find((t) => String(t.id) === activeTaskId);

        if (!activeTask) return;

        // Check if dropped on a column
        const overColumn = Object.keys(COLUMNS).find((key) => key === overId);

        if (overColumn) {
            // Dropped on a column - update status
            setJobs((tasks) =>
                tasks.map((task) =>
                    String(task.id) === activeTaskId
                        ? {...task, status: overColumn}
                        : task
                )
            );
        } else {
            // Dropped on another task
            const overTaskId = overId.replace("task-", "");
            const overTask = jobs.find((t) => String(t.id) === overTaskId);
            if (!overTask) return;

            const activeIndex = jobs.findIndex((t) => String(t.id) === activeTaskId);
            const overIndex = jobs.findIndex((t) => String(t.id) === overTaskId);

            if (activeTask.status !== overTask.status) {
                // Moving to different column
                setJobs((tasks) =>
                    tasks.map((task) =>
                        String(task.id) === activeTaskId
                            ? {...task, status: overTask.status}
                            : task
                    )
                );
            } else {
                // Reordering within same column
                setJobs((tasks) => arrayMove(tasks, activeIndex, overIndex));
            }
        }
    };

    const handleDragEnd = async (event: any) => {
        const {active, over} = event;
        setActiveId(null);

        if (!over) {
            console.log("No drop target");
            return;
        }

        // Extract job ID from the task ID
        const taskId = active.id.replace("task-", "");
        const jobId = Number(taskId);

        console.log("Drag ended - Active ID:", active.id, "Over ID:", over.id);
        console.log("Job ID:", jobId);

        // Find the current job with the updated status from handleDragOver
        const currentJob = jobs.find((job) => job.id === jobId);
        if (!currentJob) {
            console.log("Current job not found");
            return;
        }

        // The status might have already been updated by handleDragOver
        // We need to get the final status from where it was dropped
        let finalStatus: string;

        // Check if dropped directly on a column
        if (Object.keys(COLUMNS).includes(over.id)) {
            finalStatus = over.id;
            console.log("Dropped on column:", finalStatus);
        } else {
            // Dropped on a task - the status was already updated by handleDragOver
            // Use the current job's status which was set during drag over
            finalStatus = currentJob.status;
            console.log("Using current status from dragOver:", finalStatus);
        }

        console.log("Final status:", finalStatus, "Job will be saved to backend");

        // Always make the API call to persist the change
        // (Don't check if status changed, as handleDragOver already updated it)
        try {
            console.log("Calling API with:", { job_id: jobId, status_value: finalStatus });
            const response = await axios.patch("/api/jobs/update", {
                job_id: jobId,
                status_value: finalStatus,
            });
            console.log("API response:", response.data);
        } catch (error: any) {
            console.error("Status update failed:", error);
            console.error("Error details:", error.response?.data);
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
                    <div className="flex gap-3 overflow-x-auto pb-4">
                        {Object.values(COLUMNS).map((column) => (
                            <Column
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                icon={column.icon}
                                tasks={getTasksByStatus(column.id)}
                                onDeleteJob={deleteJob}
                            />
                        ))}
                    </div>
                </DndContext>
            </main>
        </>
    );
}
