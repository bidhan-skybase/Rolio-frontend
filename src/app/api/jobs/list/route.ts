import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import axios from "axios";

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
        const res = await axios.get('http://127.0.0.1:8000/api/v1/list', config);
        return NextResponse.json(res.data);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Failed to get dashboard data' }, { status: 500 });
    }

}
