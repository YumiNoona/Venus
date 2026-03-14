import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const { projectId } = (await request.json().catch(() => ({}))) as {
    projectId?: string;
  };

  if (!projectId) {
    return NextResponse.json(
      { error: "Missing projectId" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();

  const ipHeader =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    null;
  const ip = ipHeader ? ipHeader.split(",")[0]?.trim() ?? null : null;
  const device = request.headers.get("user-agent") ?? null;

  await (supabase as any)
    .from("visitors")
    .insert({
      project_id: projectId,
      ip,
      device
    });

  return NextResponse.json({ ok: true });
}

