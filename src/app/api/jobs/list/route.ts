import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import axios from "axios";
import {API_BASE_URL} from "@/types/constants";

export async  function  GET(){
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
        const res = await axios.get(`${API_BASE_URL}/list`, config);
        return NextResponse.json(res.data);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Failed to get dashboard data' }, { status: 500 });
    }

}
