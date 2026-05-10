import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true, _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
=======
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userCount = await prisma.user.count();
  const taskCount = await prisma.task.count();

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ userCount, taskCount, users });
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
}