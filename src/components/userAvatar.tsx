'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UserAvatar() {
    const [email, setEmail] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside the component to close the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    useEffect(() => {
        // Get email from cookies
        const cookies = document.cookie;
        const token = cookies
            .split('; ')
            .find((row) => row.startsWith('email='))
            ?.split('=')[1];

        if (token) {
            setEmail(decodeURIComponent(token));
            // Generate a random background color from a palette
            const colors = ['#6C5CE7', '#A29BFE', '#00CEC9', '#FD79A8', '#FAB1A0'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setBgColor(randomColor);
        }
    }, []);

    const handleLogout = () => {
        // Clear the email cookie
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirect to the auth page
        router.push('/auth');
    };

    const firstLetter = email ? email.charAt(0).toUpperCase() : '?';

    if (!email) {
        // If the user is not logged in, don't render the avatar
        return null;
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
                style={{ backgroundColor: bgColor || '#ccc' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {firstLetter}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                    <div
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        Log out
                    </div>
                </div>
            )}
        </div>
    );
}