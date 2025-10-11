'use client';
import Image from "next/image";
import {useState} from "react";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const tabs = ['Dashboard', 'Job Board', 'Resumes'];

    return <div className='h-screen w-full bg-gray-50 flex flex-col'>

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
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab}
                            </button>
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
        <div className='pt-4 px-4'>
            <p className='text-3xl font-semibold'>Dashboard</p>
            <p className='text-[16px] font-medium text-gray-500'>Overview for all your jobs</p>
        </div>

        <main className="flex-1 p-4 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {/* First Row - 3 items */}
                <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                    <p className="text-gray-600">Total saved jobs</p>
                </div>
                <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                    <p className="text-gray-600">Total applied jobs</p>
                </div>
                <div className="p-6 bg-blue-100 rounded-[4px] row-span-1">
                    <h2 className="font-semibold text-lg mb-2">Card 3</h2>
                    <p className="text-gray-600">Total jobs offered</p>
                </div>

                {/* Second Row - 2 items */}
                <div className="p-6 bg-yellow-100 rounded-[4px] md:col-span-1 lg:col-span-2 row-span-1">
                    <p className="text-gray-600">List of jobs</p>
                </div>
                <div className="p-6 bg-pink-100 rounded-[4px] md:col-span-1 lg:col-span-1 row-span-1">
                    <p className="text-gray-600">Graph for jobs</p>
                </div>
            </div>
        </main>

    </div>
}
