import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const taskCount = await prisma.task.count();
    return NextResponse.json({ 
      success: true, 
      users: userCount, 
      tasks: taskCount,
      message: "Database connected successfully!" 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Database error:", errorMessage);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}