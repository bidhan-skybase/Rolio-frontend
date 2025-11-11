import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import axios from "axios";
import {API_BASE_URL} from "@/types/constants";

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
            `${API_BASE_URL}/delete/${id}`,
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

