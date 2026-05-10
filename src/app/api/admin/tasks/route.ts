import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions) as { user?: { id?: string; role?: string } } | null;
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tasks = await prisma.task.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}