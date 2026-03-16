"use server"

import { revalidatePath } from "next/cache";

/**
 * Helper to fetch with Vercel API credentials
 */
async function fetchVercelAPI(endpoint: string, method: string = "GET", body?: any) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID; // Optional
  const token = process.env.VERCEL_AUTH_TOKEN;

  if (!projectId || !token) {
    console.warn("Vercel API credentials (VERCEL_PROJECT_ID, VERCEL_AUTH_TOKEN) are missing.");
    return { error: "Vercel API credentials missing.", ok: false };
  }

  let url = `https://api.vercel.com${endpoint}`;
  if (teamId) {
    url += `?teamId=${teamId}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { 
        ok: false, 
        error: errorData.error?.message || `Vercel API error (${res.status})` 
      };
    }

    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

/**
 * Registers a new custom domain for the Vercel project
 */
export async function addCustomDomainToVercel(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) return { success: false, error: "Vercel Project ID missing." };

  const result = await fetchVercelAPI(`/v10/projects/${projectId}/domains`, "POST", {
    name: domain,
  });

  if (!result.ok) {
    console.error("Failed to add domain to Vercel:", result.error);
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}

/**
 * Removes a custom domain from the Vercel project
 */
export async function removeCustomDomainFromVercel(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) return { success: false, error: "Vercel Project ID missing." };

  const result = await fetchVercelAPI(`/v9/projects/${projectId}/domains/${domain}`, "DELETE");

  if (!result.ok) {
    console.error("Failed to remove domain from Vercel:", result.error);
    return { success: false, error: result.error };
  }

  return { success: true };
}

/**
 * Checks the verification status of a domain (DNS config)
 */
export async function verifyDomainStatus(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) return { success: false, error: "Vercel Project ID missing." };

  const result = await fetchVercelAPI(`/v9/projects/${projectId}/domains/${domain}/verify`, "POST");

  if (!result.ok) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
