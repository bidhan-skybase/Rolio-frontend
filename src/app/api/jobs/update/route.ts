import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const { job_id, status_value } = await req.json();

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const res = await axios.patch(
            `http://127.0.0.1:8000/api/v1/${job_id}/status`,
            null,
            {
                ...config,
                params: { status_value },
            }
        );

        return NextResponse.json(res.data, { status: 200 });
    } catch (error: any) {
        console.error("Update error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to update the job" },
            { status: error.response?.status || 500 }
        );
    }
}

