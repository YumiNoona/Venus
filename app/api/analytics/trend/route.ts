import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: userProjects } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id);
      
    const projectIds = (userProjects || []).map((p: any) => p.id);

    const { data: visitorTrend } = await supabase
      .from("visitors")
      .select("visited_at")
      .in("project_id", projectIds)
      .gte("visited_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    return NextResponse.json(visitorTrend || []);
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
