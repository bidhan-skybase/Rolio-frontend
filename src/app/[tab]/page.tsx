// app/[tab]/page.tsx
'use client';
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {useEffect, useState} from "react";
import Dashboard from "@/app/[tab]/dashboard";
import JobBoard from "@/app/[tab]/job-board";
import Resumes from "@/app/[tab]/resumes";
import axios from "axios";
import UserAvatar from "@/components/userAvatar";


const tabs = ['dashboard', 'job-board', 'resumes'];

export default function DashboardPage() {
    const params = useParams();
    const router = useRouter();
    const currentTab = params.tab as string;
    const [dashboardData, setDashboardData] = useState({
        applied: 0,
        offered: 0,
        saved: 0
    });    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[jobs,setJobs]=useState([]);


    useEffect(() => {
        if (!currentTab || !tabs.includes(currentTab)) {
            router.replace('/job-board');
        }
    }, [currentTab, router]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard');
                console.log("Dashboard data:", res.data);
                setDashboardData(res.data);
                setError(null);
            } catch (err:any) {
                console.error("Error fetching dashboard:", err);
                setError(err.message || 'Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    useEffect(() => {
        const getJobLists=async ()=>{
            try{
                setLoading(true);
                const res=await axios.get('/api/jobs/list');
                console.log("Job list:",res.data);
                setJobs(res.data);
                setError(null)
            }catch (err:any){
                console.error('Error fetching jobs list');
                setError(err.message || 'Failed to fetch job data');
            }finally {
                {
                    setLoading(false);
                }
            }
        }
        getJobLists();
    }, []);

    // const getTabLabel = (slug: string) => {
    //     const labels = {
    //         'dashboard': 'Dashboard',
    //         'job-board': 'Job Board',
    //         'resumes': 'Resumes'
    //     };
    //     return labels[slug as keyof typeof labels] || slug;
    // };

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
                        {/*<div className="inline-flex bg-gray-200 rounded-lg p-1 ml-12">*/}
                        {/*    {tabs.map((tab) => (*/}
                        {/*        <Link*/}
                        {/*            key={tab}*/}
                        {/*            href={`/${tab}`}*/}
                        {/*            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${*/}
                        {/*                currentTab === tab*/}
                        {/*                    ? 'bg-white text-gray-900 shadow-sm'*/}
                        {/*                    : 'text-gray-600 hover:text-gray-900'*/}
                        {/*            }`}*/}
                        {/*        >*/}
                        {/*            {getTabLabel(tab)}*/}
                        {/*        </Link>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                    </div>

                   <UserAvatar></UserAvatar>
                </div>
            </header>

            {/* Render content based on current tab */}
            {currentTab === 'dashboard' && <Dashboard stats={dashboardData} />}
            {currentTab === 'job-board' && <JobBoard />}
            {currentTab === 'resumes' && <Resumes />}
        </div>
    );
}


