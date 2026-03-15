import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { hashIP } from "@/lib/utils/privacy";
import { UAParser } from "ua-parser-js";
import { redis, CACHE_KEYS } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [] } }
    );

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const ipHash = await hashIP(ip);

    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    let device = "Desktop";
    if (result.device.type === "mobile") device = result.device.vendor || "Mobile";
    else if (result.device.type === "tablet") device = "Tablet";
    else if (result.os.name) device = result.os.name;

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    
    // Check for duplicate
    const { data: existing } = await supabase
      .from("visitors")
      .select("id")
      .eq("project_id", projectId)
      .eq("ip_hash", ipHash)
      .gte("visited_at", oneMinuteAgo)
      .limit(1)
      .maybeSingle();

    if (existing) return NextResponse.json({ skipped: true });

    // Track
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();

    await supabase.from("visitors").insert({
      project_id: projectId,
      ip_hash: ipHash,
      device: device.substring(0, 255),
      visited_at: new Date().toISOString()
    });

    // Invalidate Redis Cache for the user
    if (project?.user_id) {
      const cacheKey = CACHE_KEYS.PROJECT_STATS(project.user_id);
      void redis.del(cacheKey).catch(e => console.error("Redis del failed:", e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
