import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions) as { user?: { id?: string } } | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userCount = await prisma.user.count();

  return NextResponse.json({ userCount });
}