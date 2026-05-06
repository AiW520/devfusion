import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.courseProgress.findMany({
    where: { userId: session.user.id },
    include: { unit: true, weaknesses: true },
  });

  return NextResponse.json(progress);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { unitId, completed, score } = await req.json();

  const progress = await prisma.courseProgress.upsert({
    where: {
      userId_unitId: {
        userId: session.user.id,
        unitId,
      },
    },
    update: { completed, score },
    create: {
      userId: session.user.id,
      unitId,
      completed,
      score,
    },
  });

  return NextResponse.json(progress);
}
