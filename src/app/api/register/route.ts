import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, adminSecret } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Please enter a password" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const isAdmin = adminSecret === process.env.ADMIN_SECRET;
    
    const user = await prisma.user.create({
      data: { 
        email: normalizedEmail, 
        password: hashedPassword, 
        name: (name && name.trim()) || normalizedEmail.split("@")[0],
        role: isAdmin ? "admin" : "user"
      },
    });

    return NextResponse.json(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        message: isAdmin ? "Admin account created successfully!" : "Account created successfully!"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }
}
