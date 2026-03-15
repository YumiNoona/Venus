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
  const ip = ipHeader ? ipHeader.split(",")[0]?.trim() ?? "unknown" : "unknown";
  const device = request.headers.get("user-agent") || "unknown";

  const { hashIP } = await import("@/lib/utils/privacy");
  const hashedIp = await hashIP(ip || "unknown");

  await (supabase as any)
    .from("visitors")
    .insert({
      project_id: projectId,
      ip_hash: hashedIp,
      device
    });

  return NextResponse.json({ ok: true });
}

