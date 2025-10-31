import {NextResponse} from "next/server";
import axios from "axios";

export async function POST(req:Request){
    const{email,otp}=await req.json();

    try{
        const res = await axios.post('http://127.0.0.1:8000/api/v1/verify_otp', {
            email,
            otp
        });

        return NextResponse.json(res.data);

    }catch (err){
        console.error(err);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });

    }
}
