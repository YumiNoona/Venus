"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeads } from "@/app/(studio)/leads/actions";

export function useDashboardLeads(options: any = {}) {
  return useQuery({
    queryKey: ["leads", options],
    queryFn: () => getLeads(options),
    staleTime: 30000, // 30 seconds
  });
}
