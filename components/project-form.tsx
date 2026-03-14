"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Textarea, Label, Button, Card } from "@/components/ui";
import { slugify } from "@/lib/slugify";

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

    // ensure slug uniqueness, allowing current project to retain its slug
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
      // if uniqueness check fails, fallback to user-provided slug
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
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
      <form
        onSubmit={handleSubmit}
        className="glass-panel space-y-4 p-5"
      >
        <div className="space-y-1">
          <Label htmlFor="name">Project name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={values.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
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
          <div className="space-y-1">
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
        <div className="space-y-1">
          <Label htmlFor="short_description">
            Short description
          </Label>
          <Input
            id="short_description"
            value={values.short_description}
            onChange={(e) =>
              handleChange("short_description", e.target.value)
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="long_description">
            Story / long description
          </Label>
          <Textarea
            id="long_description"
            rows={6}
            value={values.long_description}
            onChange={(e) =>
              handleChange("long_description", e.target.value)
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="stream_url">Streaming URL</Label>
          <Input
            id="stream_url"
            placeholder="https://"
            value={values.stream_url}
            onChange={(e) =>
              handleChange("stream_url", e.target.value)
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Auth type</Label>
            <select
              className="w-full rounded-md border border-[color:var(--border)] bg-[#09090b] px-3 py-2 text-sm text-[color:var(--text-primary)] outline-none ring-0 transition-colors duration-150 ease-subtle focus:border-[color:var(--accent)]"
              value={values.auth_type}
              onChange={(e) =>
                handleChange(
                  "auth_type",
                  e.target.value as AuthType
                )
              }
            >
              <option value="public">Public</option>
              <option value="password">Password</option>
              <option value="otp" disabled>
                OTP (coming soon)
              </option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password (if required)</Label>
            <Input
              id="password"
              type="password"
              disabled={values.auth_type !== "password"}
              value={values.password}
              onChange={(e) =>
                handleChange("password", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Publish</Label>
            <button
              type="button"
              onClick={() =>
                handleChange("published", !values.published)
              }
              className={`inline-flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs transition-colors duration-150 ease-subtle ${
                values.published
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                  : "border-[color:var(--border)] bg-[#09090b] text-[color:var(--text-secondary)]"
              }`}
            >
              <span>
                {values.published ? "Published" : "Draft"}
              </span>
              <span
                className={`h-4 w-8 rounded-full bg-[#020617] transition-colors ${
                  values.published
                    ? "bg-[color:var(--accent)]/40"
                    : ""
                }`}
              >
                <span
                  className={`block h-4 w-4 translate-x-0 rounded-full bg-white transition-transform ${
                    values.published
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving project…"
              : values.id
              ? "Save changes"
              : "Create project"}
          </Button>
        </div>
      </form>
      <Card className="p-5">
        <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
          <span>Public preview</span>
          <span className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
            /project/{values.slug || "your-project"}
          </span>
        </div>
        <div className="mt-5 space-y-3">
          <div className="h-32 w-full overflow-hidden rounded-lg border border-[color:var(--border)] bg-[radial-gradient(circle_at_0%_0%,#1f2933,transparent_45%),radial-gradient(circle_at_100%_100%,#020617,transparent_50%)]" />
          <div className="space-y-1">
            <div className="text-sm font-medium tracking-tight">
              {values.name || "Project title"}
            </div>
            <div className="text-xs text-[color:var(--text-secondary)]">
              {values.short_description ||
                "Short description will appear here for clients."}
            </div>
          </div>
          <button
            type="button"
            className="btn-primary mt-2 w-full justify-between text-xs"
          >
            <span>Dive experience</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
              Preview
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
}

