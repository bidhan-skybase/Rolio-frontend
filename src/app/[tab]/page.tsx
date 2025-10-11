// app/[tab]/page.tsx
'use client';
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const tabs = ['dashboard', 'job-board', 'resumes'];

export default function DashboardPage() {
    const params = useParams();
    const router = useRouter();
    const currentTab = params.tab as string;

    useEffect(() => {
        if (!currentTab || !tabs.includes(currentTab)) {
            router.replace('/dashboard');
        }
    }, [currentTab, router]);

    const getTabLabel = (slug: string) => {
        const labels = {
            'dashboard': 'Dashboard',
            'job-board': 'Job Board',
            'resumes': 'Resumes'
        };
        return labels[slug as keyof typeof labels] || slug;
    };

    return (
        <div className='h-screen w-full bg-gray-50 flex flex-col'>
            <header className='border-b-2 border-gray-200 py-4 px-6 flex-shrink-0'>
                <div className='flex flex-row justify-between items-center'>
                    <div className="flex flex-row items-center">
                        <Image
                            src="/evil-rabbit.png"
                            alt="main logo"
                            width={40}
                            height={40}
                            style={{borderRadius: 12}}
                        />
                        <h1 className="font-semibold text-2xl pl-2">Rolio</h1>
                        <div className="inline-flex bg-gray-200 rounded-lg p-1 ml-12">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab}
                                    href={`/${tab}`}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        currentTab === tab
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {getTabLabel(tab)}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                            src="/user.png"
                            alt="user avatar"
                            width={40}
                            height={40}
                        />
                    </div>
                </div>
            </header>

            {/* Render content based on current tab */}
            {currentTab === 'dashboard' && <DashboardContent />}
            {currentTab === 'job-board' && <JobBoardContent />}
            {currentTab === 'resumes' && <ResumesContent />}
        </div>
    );
}

// Dashboard Tab Content
function DashboardContent() {
    return (
        <>
            <div className='pt-4 px-4'>
                <p className='text-3xl font-semibold'>Dashboard</p>
                <p className='text-[16px] font-medium text-gray-500'>Overview for all your jobs</p>
            </div>
            <main className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                    <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Total saved jobs</p>
                    </div>
                    <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Total applied jobs</p>
                    </div>
                    <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Total jobs offered</p>
                    </div>
                    <div className="p-6 bg-yellow-100 rounded-[4px] md:col-span-1 lg:col-span-2 row-span-1">
                        <p className="text-gray-600">List of jobs</p>
                    </div>
                    <div className="p-6 bg-pink-100 rounded-[4px] md:col-span-1 lg:col-span-1 row-span-1">
                        <p className="text-gray-600">Graph for jobs</p>
                    </div>
                </div>
            </main>
        </>
    );
}

// Job Board Tab Content
function JobBoardContent() {
    return (
        <>
            <div className='pt-4 px-4'>
                <p className='text-3xl font-semibold'>Job Board</p>
                <p className='text-[16px] font-medium text-gray-500'>Browse and apply to jobs</p>
            </div>
            <main className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                    <div className="p-6 bg-green-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Active Listings</p>
                    </div>
                    <div className="p-6 bg-purple-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Saved Jobs</p>
                    </div>
                    <div className="p-6 bg-orange-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Applied</p>
                    </div>
                    <div className="p-6 bg-cyan-100 rounded-[4px] md:col-span-1 lg:col-span-2 row-span-1">
                        <p className="text-gray-600">Job Search Results</p>
                    </div>
                    <div className="p-6 bg-indigo-100 rounded-[4px] md:col-span-1 lg:col-span-1 row-span-1">
                        <p className="text-gray-600">Filters</p>
                    </div>
                </div>
            </main>
        </>
    );
}

// Resumes Tab Content
function ResumesContent() {
    return (
        <>
            <div className='pt-4 px-4'>
                <p className='text-3xl font-semibold'>Resumes</p>
                <p className='text-[16px] font-medium text-gray-500'>Manage your resumes and cover letters</p>
            </div>
            <main className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                    <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Master Resume</p>
                    </div>
                    <div className="p-6 bg-purple-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Tech Resume</p>
                    </div>
                    <div className="p-6 bg-green-100 rounded-[4px] row-span-1">
                        <p className="text-gray-600">Templates</p>
                    </div>
                    <div className="p-6 bg-yellow-100 rounded-[4px] md:col-span-1 lg:col-span-2 row-span-1">
                        <p className="text-gray-600">Recent Versions</p>
                    </div>
                    <div className="p-6 bg-pink-100 rounded-[4px] md:col-span-1 lg:col-span-1 row-span-1">
                        <p className="text-gray-600">Cover Letters</p>
                    </div>
                </div>
            </main>
        </>
    );
}
