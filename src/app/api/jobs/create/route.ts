import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import axios from "axios";
import {JobInterface} from "@/types/jobs";
import {API_BASE_URL} from "@/types/constants";


export async function POST(req: Request, res: Response) {
    const cookieStore=await cookies();
    const token=cookieStore.get("access_token")?.value;
    const jobModel: JobInterface = await req.json();

    if(!token){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try{

        const res= await axios.post<JobInterface[]>(`${API_BASE_URL}/create`,
            jobModel,{
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
            }
        )

        console.log("response")
        console.log(res.data);
        return NextResponse.json(res.data);

    }catch (err){
        console.log(err);
        return NextResponse.json({error:"Failed to add job"},{status:500})
    }
}
