import React from 'react';
import { MoveUpRight } from 'lucide-react';

interface DashboardProps {
    stats: {
        applied: number;
        offered: number;
        saved: number;
    };
}

export default function Dashboard({stats}:DashboardProps) {
    return (

        <main className="min-h-screen">
            <div className='pt-4 px-4 pb-2'>
                <p className='text-2xl font-semibold'>Dashboard</p>
                <p className='text-[16px] font-medium text-gray-500'>Overview for your recent activity</p>
            </div>
            <div className="max-w-screen  p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Card 1 - Total Saved Jobs */}
                    <div className="group relative bg-gradient-to-br from-black to-gray-500 rounded-[4px] p-12 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20">
                        <div className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer">
                            <MoveUpRight color="white" className="w-5 h-5" />
                        </div>

                        <div className="font-medium text-xl text-gray-300 mb-8">Total Saved Jobs</div>
                        <div className="text-7xl font-bold text-white">{stats.saved}</div>
                    </div>

                    {/* Card 2 - Total Jobs Applied */}
                    <div className="group relative bg-gradient-to-br from-blue-400 to-blue-600 rounded-[4px] p-12 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
                        <div className="absolute top-6 right-6 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer">
                            <MoveUpRight color="white" className="w-5 h-5" />
                        </div>

                        <div className="font-medium text-xl text-white/90 mb-8">Total Jobs Applied</div>
                        <div className="text-7xl font-bold text-white">{stats.applied}</div>
                    </div>

                    {/* Card 3 - Total Jobs Offered */}
                    <div className="group relative bg-gradient-to-br from-green-400 to-green-600 rounded-[4px] p-12 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30">
                        <div className="absolute top-6 right-6 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer">
                            <MoveUpRight color="white" className="w-5 h-5" />
                        </div>

                        <div className="font-medium text-xl text-white/90 mb-8">Total Jobs Offered</div>
                        <div className="text-7xl font-bold text-white">{stats.offered}</div>
                    </div>
                </div>

                {/* Bottom sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 p-8 bg-yellow-100 rounded-[4px]">
                        <p className="text-gray-600">List of jobs</p>
                    </div>

                    <div className="p-8 bg-pink-100 rounded-[4px]">
                        <p className="text-gray-600">Graph for jobs</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
