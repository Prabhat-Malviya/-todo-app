import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions) as { user?: { id?: string; role?: string } } | null;
  
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const totalUsers = await prisma.user.count();
  const totalTasks = await prisma.task.count();
  const completedTasks = await prisma.task.count({ where: { completed: true } });
  const pendingTasks = totalTasks - completedTasks;

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, lastLogin: true, lastActive: true, createdAt: true },
  });

  const activeUsers = users.filter(u => u.lastActive && new Date(u.lastActive).getTime() > Date.now() - 30 * 60 * 1000).length;
  const loggedInUsers = users.filter(u => u.lastLogin && (!u.lastActive || new Date(u.lastActive).getTime() > new Date(u.lastLogin).getTime() - 30 * 60 * 1000)).length;

  return NextResponse.json({
    totalUsers,
    totalTasks,
    completedTasks,
    pendingTasks,
    activeUsers,
    loggedInUsers,
  });
}