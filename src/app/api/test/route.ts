import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const taskCount = await prisma.task.count();
    return NextResponse.json({ 
      success: true, 
      users: userCount, 
      tasks: taskCount 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Database connection failed" 
    }, { status: 500 });
  }
}