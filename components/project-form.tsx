"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Textarea, Label, Button, Card, Badge } from "@/components/ui";
import { slugify } from "@/lib/slugify";
import { ExternalLink, Eye } from "lucide-react";

type AuthType = "public" | "password" | "otp";

export interface ProjectFormValues {
  id?: string;
  name: string;
  slug: string;
  thumbnail_light: string;
  thumbnail_dark: string;
  short_description: string;
  long_description: string;
  stream_url: string;
  auth_type: AuthType;
  password: string;
  published: boolean;
}

interface ProjectFormProps {
  initial?: Partial<ProjectFormValues>;
}

export function ProjectForm({ initial }: ProjectFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>({
    id: initial?.id,
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    thumbnail_light: initial?.thumbnail_light ?? "",
    thumbnail_dark: initial?.thumbnail_dark ?? "",
    short_description: initial?.short_description ?? "",
    long_description: initial?.long_description ?? "",
    stream_url: initial?.stream_url ?? "",
    auth_type: (initial?.auth_type as AuthType) ?? "public",
    password: initial?.password ?? "",
    published: initial?.published ?? false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial?.slug && values.name) {
      setValues((prev) => ({
        ...prev,
        slug: slugify(values.name)
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.name]);

  function handleChange(
    field: keyof ProjectFormValues,
    value: string | boolean
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      values.stream_url &&
      !values.stream_url.toLowerCase().startsWith("https://")
    ) {
      setError("Streaming URL must start with https://");
      return;
    }

    setSaving(true);

    const supabase = createBrowserSupabaseClient();

    let finalSlug = values.slug || slugify(values.name);
    try {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { data: existing } = await (supabase as any)
          .from("projects")
          .select("id")
          .eq("slug", finalSlug)
          .maybeSingle();

        if (!existing || (values.id && existing.id === values.id)) {
          break;
        }

        const suffix = Math.random().toString(36).slice(2, 6);
        finalSlug = `${finalSlug}-${suffix}`;
      }
    } catch {
      // fallback to user-provided slug
    }

    if (finalSlug !== values.slug) {
      setValues((prev) => ({ ...prev, slug: finalSlug }));
    }

    const payload: Record<string, unknown> = {
      name: values.name,
      slug: finalSlug,
      thumbnail_light: values.thumbnail_light || null,
      thumbnail_dark: values.thumbnail_dark || null,
      short_description: values.short_description || null,
      long_description: values.long_description || null,
      stream_url: values.stream_url || null,
      auth_type: values.auth_type,
      password:
        values.auth_type === "password" && values.password
          ? values.password
          : null,
      published: values.published
    };

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setSaving(false);
      setError("You must be signed in.");
      return;
    }

    let errorResult: { message: string } | null = null;

    if (values.id) {
      const { error } = await (supabase as any)
        .from("projects")
        .update(payload)
        .eq("id", values.id)
        .eq("user_id", userId);
      errorResult = error;
    } else {
      const { error } = await (supabase as any)
        .from("projects")
        .insert({ ...payload, user_id: userId });
      errorResult = error;
    }

    setSaving(false);

    if (errorResult) {
      setError(errorResult.message);
      return;
    }

    router.push("/projects");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      {/* ─── Form ──────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="glass-panel space-y-5 p-6 animate-slide-up"
      >
        {/* Project name + slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="Skyline Residence Tower A"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="skyline-residence-tower-a"
              value={values.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="thumbnail_light">Thumbnail (light)</Label>
            <Input
              id="thumbnail_light"
              placeholder="https://…"
              value={values.thumbnail_light}
              onChange={(e) =>
                handleChange("thumbnail_light", e.target.value)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="thumbnail_dark">Thumbnail (dark)</Label>
            <Input
              id="thumbnail_dark"
              placeholder="https://…"
              value={values.thumbnail_dark}
              onChange={(e) =>
                handleChange("thumbnail_dark", e.target.value)
              }
            />
          </div>
        </div>

        {/* Short description */}
        <div className="space-y-1.5">
          <Label htmlFor="short_description">Short description</Label>
          <Input
            id="short_description"
            placeholder="A brief summary for the project card"
            value={values.short_description}
            onChange={(e) =>
              handleChange("short_description", e.target.value)
            }
          />
        </div>

        {/* Long description */}
        <div className="space-y-1.5">
          <Label htmlFor="long_description">Story / long description</Label>
          <Textarea
            id="long_description"
            rows={6}
            placeholder="The full narrative your clients see on the project page…"
            value={values.long_description}
            onChange={(e) =>
              handleChange("long_description", e.target.value)
            }
          />
        </div>

        {/* Stream URL */}
        <div className="space-y-1.5">
          <Label htmlFor="stream_url">Streaming URL</Label>
          <Input
            id="stream_url"
            placeholder="https://stream.example.com/session/…"
            value={values.stream_url}
            onChange={(e) => handleChange("stream_url", e.target.value)}
          />
        </div>

        {/* Auth + Password + Publish */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Auth type</Label>
            <select
              className="input-field"
              value={values.auth_type}
              onChange={(e) =>
                handleChange("auth_type", e.target.value as AuthType)
              }
            >
              <option value="public">Public</option>
              <option value="password">Password</option>
              <option value="otp" disabled>
                OTP (coming soon)
              </option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password (if required)</Label>
            <Input
              id="password"
              type="password"
              disabled={values.auth_type !== "password"}
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Publish</Label>
            <button
              type="button"
              onClick={() => handleChange("published", !values.published)}
              className={`flex h-9 w-full items-center justify-between rounded-lg border px-3 text-xs font-medium transition-all duration-150 ease-subtle ${
                values.published
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                  : "border-[color:var(--border)] bg-[#09090b] text-[color:var(--text-secondary)]"
              }`}
            >
              <span>{values.published ? "Published" : "Draft"}</span>
              <span
                className={`relative h-5 w-9 rounded-full transition-colors duration-150 ${
                  values.published
                    ? "bg-[color:var(--accent)]"
                    : "bg-[#1e1e22]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-150 ${
                    values.published ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-[color:var(--danger-soft)] px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-[color:var(--border)] pt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={saving}>
            {saving
              ? "Saving project…"
              : values.id
              ? "Save changes"
              : "Create project"}
          </Button>
        </div>
      </form>

      {/* ─── Live preview ──────────────────────────────────── */}
      <div className="animate-slide-up delay-1">
        <Card className="sticky top-8 p-5">
          <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Public preview
            </span>
            <span className="badge badge-default">
              <ExternalLink className="h-2.5 w-2.5" />
              /project/{values.slug || "your-project"}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Thumbnail preview */}
            <div className="h-36 w-full overflow-hidden rounded-lg border border-[color:var(--border)] bg-[#050608]">
              {values.thumbnail_dark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.thumbnail_dark}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#1a1d24,transparent_50%),radial-gradient(circle_at_70%_80%,#0d0f15,transparent_50%)]">
                  <div className="text-xs text-[color:var(--text-secondary)]">
                    Add a thumbnail URL
                  </div>
                </div>
              )}
            </div>

            {/* Text preview */}
            <div className="space-y-1.5">
              <div className="text-sm font-medium tracking-tight">
                {values.name || "Project title"}
              </div>
              <div className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                {values.short_description ||
                  "Short description will appear here for clients."}
              </div>
            </div>

            {/* CTA preview */}
            <button
              type="button"
              className="btn-primary mt-2 w-full justify-between text-xs"
            >
              <span>Dive experience</span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
                Preview
              </span>
            </button>

            {/* Status */}
            <div className="flex items-center justify-center pt-1">
              <Badge variant={values.published ? "success" : "default"}>
                {values.published ? "Published — visible to clients" : "Draft — not visible"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
