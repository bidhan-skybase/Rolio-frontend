/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import {API_BASE_URL} from "@/types/constants";

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
        const res = await axios.get(`${API_BASE_URL}/stats`,config);
        return NextResponse.json(res.data);
    } catch (err: any) {
        console.error('Dashboard fetch failed:', err.response?.data || err.message);
        const status = err.response?.status || 500;
        const message = err.response?.data || { error: 'Failed to get dashboard data' };
        return NextResponse.json(message, { status });
    }
}
