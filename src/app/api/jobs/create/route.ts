import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import axios from "axios";
import {JobInterface} from "@/types/jobs";


export async function POST(req: Request, res: Response) {
    const cookieStore=await cookies();
    const token=cookieStore.get("access_token")?.value;
    const jobModel: JobInterface = await req.json();

    if(!token){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try{

        const res= await axios.post<JobInterface[]>("http://127.0.0.1:8000/api/v1/create",
            jobModel,{
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
            }
        )
        return NextResponse.json(res.data);

    }catch (err){
        console.log(err);
        return NextResponse.json({error:"Failed to add job"},{status:500})
    }
}
