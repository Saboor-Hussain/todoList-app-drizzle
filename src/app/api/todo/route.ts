
import { NextRequest , NextResponse } from 'next/server';
import {todoTable ,  db } from '@/lib/drizzle'
import {sql} from "@vercel/postgres";

export async function GET(request:NextRequest){

    try{
        await sql`CREATE TABLE IF NOT EXISTS Todos( id serial, Task VARCHAR(255));`;
        
        const res = await db.select().from(todoTable);

        // console.log(res[0]);
        // console.log(res.rows.find((item) => item.id === 1));

        return NextResponse.json({data: res});


    } catch(err){
        console.log(err);
        console.log((err as {message:string}).message);
        return NextResponse.json("Something went wrong");
    }
}

export async function POST(request:NextRequest) {
    
    const req = await request.json();

    try{
        if(req.task){             
            const res = await db.insert(todoTable).values({
                task: req.task,
            }).returning();


            console.log(res);
            return NextResponse.json({message: " Data Added Successfully" , data: res});
        } else{
            throw new Error("Task field is Required");

        }

    } catch(error){
        return NextResponse.json({message : ( error as {message:string}).message } );

    }

}