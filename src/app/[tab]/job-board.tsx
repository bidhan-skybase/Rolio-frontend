export default function JobBoard() {
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
