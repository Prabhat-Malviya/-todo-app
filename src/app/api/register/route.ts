import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  adminSecret: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, adminSecret } = schema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const isAdmin = adminSecret === process.env.ADMIN_SECRET;
    
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name: name || "User",
        role: isAdmin ? "admin" : "user"
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
