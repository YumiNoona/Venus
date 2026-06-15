import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { hashIP } from "@/lib/utils/privacy";

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

  const hashedIp = await hashIP(ip);

  const { error } = await supabase
    .from("visitors")
    .insert({
      project_id: projectId,
      ip_hash: hashedIp,
      device
    });

  if (error) {
    console.error("Failed to record visit:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

