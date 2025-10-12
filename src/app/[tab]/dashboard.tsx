export default function Dashboard() {

    return (
        <>
            <div className='pt-4 px-4 pb-4'>
                <p className='text-2xl font-semibold'>Dashboard</p>
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
