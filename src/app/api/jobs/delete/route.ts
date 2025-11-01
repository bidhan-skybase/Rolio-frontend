import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import axios from "axios";

export async function DELETE(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const { id } = await req.json();

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
        const res = await axios.delete(
            `http://127.0.0.1:8000/api/v1/delete/${id}`,
            config
        );
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Delete error:', error.response?.data || error.message);
        return NextResponse.json(
            { error: "Failed to delete the job" },
            { status: error.response?.status || 500 }
        );
    }
}

