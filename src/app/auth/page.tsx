/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import {useState} from "react";
import TextField from "@/components/textfield";
import SocialButton from "@/components/socialMediaButton";
import Image from "next/image";
import {useRouter} from 'next/navigation';
import axios from "axios";


type Step = 'email' | 'otp';

// Icon Components
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"/>
        <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"/>
        <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"/>
        <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"/>
    </svg>
);

const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 1195 1195" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1006.933 812.8c-32 153.6-115.2 211.2-147.2 249.6-32 25.6-121.6 25.6-153.6 6.4-38.4-25.6-134.4-25.6-166.4 0-44.8 32-115.2 19.2-128 12.8-256-179.2-352-716.8 12.8-774.4 64-12.8 134.4 32 134.4 32 51.2 25.6 70.4 12.8 115.2-6.4 96-44.8 243.2-44.8 313.6 76.8-147.2 96-153.6 294.4 19.2 403.2zM802.133 64c12.8 70.4-64 224-204.8 230.4-12.8-38.4 32-217.6 204.8-230.4z"/>
    </svg>
);

interface EmailStepProps {
    email: string;
    setEmail: (email: string) => void;
    onContinue: () => void;
    isLoading: boolean;
}


const EmailStep: React.FC<EmailStepProps> = ({email, setEmail, onContinue, isLoading}) => (
    <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-semibold text-center">
            What&apos;s your email address?
        </h1>

        <TextField
            placeholder="Enter your email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <button
            onClick={onContinue}
            disabled={isLoading || !email}
            className="w-full py-3 px-4 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Loading..." : "Continue"}
        </button>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
            </div>
        </div>

        <div className="space-y-3">
            <SocialButton
                icon={<GoogleIcon/>}
                text="Continue with Google"
                onClick={() => console.log("Google login")}
            />

            <SocialButton
                icon={<AppleIcon/>}
                text="Continue with Apple"
                onClick={() => console.log("Apple login")}
            />
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
            By continuing, you agree to calls, including by autodialer,
            WhatsApp, or texts from Rolio and its affiliates.
        </p>
    </div>
);

interface OTPStepProps {
    email: string;
    otp: string;
    setOtp: (otp: string) => void;
    onVerify: () => void;
    onBack: () => void;
    isLoading: boolean;
}

const OTPStep: React.FC<OTPStepProps> = ({email, otp, setOtp, onVerify, onBack, isLoading}) => (
    <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <h1 className="text-3xl font-semibold text-center">
            Check your email
        </h1> <h4 className="text-[14px] font-regular text-center m-4">
        We’ve sent you a passcode.
        <br/>
        Please check your inbox at {email}.
    </h4>
        <div className="space-y-4">
            {/*type="email"*/}
            {/*name="email"*/}
            {/*value={email}*/}
            {/*onChange={(e) => setEmail(e.target.value)*/}
            <TextField placeholder={"Six digit code"} name={"OTP"} value={otp}
                       onChange={(e) => setOtp(e.target.value)}></TextField>

            <button
                onClick={onVerify}
                disabled={isLoading || otp.length !== 6}
                className="w-full py-3 px-4 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Verifying..." : "Verify"}
            </button>
        </div>
        <div className="flex justify-center">
            <button className="btn btn-link text-gray-600" style={{fontSize: 12,}}>Resend Code</button>
        </div>

    </div>
);


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<Step>('email');
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleEmailContinue() {
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/otp', { email });
            console.log('OTP sent:', res.data);
            setStep('otp');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleVerify() {
        if (otp.length !== 6) return;
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/verify', {
                email: email,
                otp: otp
            });
            console.log("verify otp:", res.data);
            document.cookie = `access_token=${res.data.access_token}; path=/; secure; samesite=strict`;
            document.cookie=`email=${res.data.user.email}; path=/; secure; samesite=strict`;
            router.push("/job-board");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    function getSecureMail() {

        const firstTwo = email.substring(0, 2);
        const domain = email.substring(email.indexOf("@"));
        const sanitizedEmail = firstTwo + "*****" + domain;
        return sanitizedEmail
    }

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    };

    const handleAppleLogin = () => {
        console.log("Apple login clicked");
    };

    const handleBack = () => {
        setStep('email');
        setOtp("");
    };


    return (
        <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="flex flex-col flex-[3] p-8">
                {/* Logo */}
                <div className="text-2xl font-semibold">Rolio</div>

                {/* Centered Content */}
                <div className="flex flex-1 flex-col justify-start items-center mt-32">
                    {step === 'email' && (
                        <EmailStep
                            email={email}
                            setEmail={setEmail}
                            onContinue={handleEmailContinue}
                            isLoading={isLoading}
                        />
                    )}

                    {step === 'otp' && (
                        <OTPStep
                            email={getSecureMail()}
                            otp={otp}
                            setOtp={setOtp}
                            onVerify={handleVerify}
                            onBack={handleBack}
                            isLoading={isLoading}
                        />
                    )}
                </div>

            </div>
            <div
                className="hidden lg:flex flex-1/6 bg-gradient-to-br from-amber-100 to-orange-100 items-center justify-center relative">
                <Image
                    src="/student.jpg"
                    alt="User using the system"
                    fill
                    className="object-cover"
                />
            </div>

        </div>
    );
}


