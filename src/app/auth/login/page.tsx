'use client';
import Form from 'next/form'
import {useState} from "react";
import TextField from "@/components/textfield";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    return (
        <div className="flex h-screen">

            <div className="flex flex-col flex-[3] p-8">

                <div className="font-medium text-[22px]">Rolio</div>

                {/* Centered content */}
                <div className="flex flex-1 flex-col justify-center items-center w-full max-w-md mx-auto">
                    <h4 className="font-semibold text-[28px] mt-2 text-center mb-4">
                        What&apos;s your email address?
                    </h4>
                    <TextField
                        placeholder="Enter your email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex-1 bg-amber-100">
                Right
            </div>
        </div>
    );

}
