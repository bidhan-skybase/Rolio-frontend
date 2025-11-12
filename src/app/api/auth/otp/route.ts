/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import axios from "axios";
import * as Constants from "node:constants";
import {API_BASE_URL} from "@/types/constants";

export async function POST(req: Request) {
 const{email}=await req.json();

 try{
     const res = await axios.post(`${API_BASE_URL}/request_otp`, {
         email,
     });

     return NextResponse.json(res.data);

 }catch(err){
     console.error(err);
     return NextResponse.json({ error: 'Failed to request OTP' }, { status: 500 });
 }
}
