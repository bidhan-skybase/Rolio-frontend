'use client';
import { useEffect, useState } from 'react';

export default function UserAvatar() {
    const [email, setEmail] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState<string>('');

    useEffect(() => {
        // Get email from cookies
        const cookies = document.cookie;
        const token = cookies
            .split('; ')
            .find((row) => row.startsWith('email='))
            ?.split('=')[1];

        if (token) {
            setEmail(token);
            // Generate a random background color from a palette
            const colors = ['#6C5CE7',
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            setBgColor(randomColor);
        }
    }, []);

    const firstLetter = email ? email.charAt(0).toUpperCase() : '?';

    return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
             style={{ backgroundColor: bgColor || '#ccc' }}>
            {firstLetter}
        </div>
    );
}
