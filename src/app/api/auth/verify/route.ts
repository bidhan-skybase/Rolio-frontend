import {NextResponse} from "next/server";
import axios from "axios";
import {API_BASE_URL} from "@/types/constants";

export async function POST(req:Request){
    const{email,otp}=await req.json();

    try{
        const res = await axios.post(`${API_BASE_URL}/verify_otp`, {
            email,
            otp
        });

        return NextResponse.json(res.data);

    }catch (err){
        console.error(err);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });

    }
}
