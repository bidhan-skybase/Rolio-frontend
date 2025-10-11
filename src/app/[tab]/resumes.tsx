export default function Resumes() {
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
