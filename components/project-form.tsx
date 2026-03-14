"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Textarea, Label, Button, Card, Badge, Separator } from "@/components/ui";
import { slugify } from "@/lib/slugify";
import { ArrowLeft, Box, Check, Save } from "lucide-react";
import Link from "next/link";

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
  }, [values.name, initial?.slug]);

  function handleChange(field: keyof ProjectFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const supabase = createBrowserSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setSaving(false);
      setError("User session lost. Please sign in.");
      return;
    }

    const payload = {
      user_id: userId,
      name: values.name,
      slug: values.slug || slugify(values.name),
      thumbnail_light: values.thumbnail_light || null,
      thumbnail_dark: values.thumbnail_dark || null,
      short_description: values.short_description || null,
      long_description: values.long_description || null,
      stream_url: values.stream_url || null,
      auth_type: values.auth_type,
      password: values.auth_type === "password" ? values.password : null,
      published: values.published
    };

    let errorResult: any = null;
    if (values.id) {
      const { error } = await (supabase as any).from("projects").update(payload).eq("id", values.id).eq("user_id", userId);
      errorResult = error;
    } else {
      const { error } = await (supabase as any).from("projects").insert(payload);
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 animate-in fade-in duration-300">
      {/* Form area */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="space-y-6">
          <div className="space-y-1 pb-2 border-b border-neutral-800">
            <h2 className="text-base font-semibold text-[color:var(--text-primary)]">Core Details</h2>
            <p className="text-xs text-[color:var(--text-secondary)]">The primary identity of your project.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Highland Residence"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex items-center gap-2">
                 <Input
                  id="slug"
                  value={values.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="highland-residence"
                  className="font-mono text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="short_description">Headline / Short Description</Label>
            <Input
              id="short_description"
              value={values.short_description}
              onChange={(e) => handleChange("short_description", e.target.value)}
              placeholder="Modernist cliffside villa with panoramic views."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="long_description">Project Narrative</Label>
            <Textarea
              id="long_description"
              value={values.long_description}
              onChange={(e) => handleChange("long_description", e.target.value)}
              placeholder="Tell the story of this architectural achievement..."
              rows={8}
            />
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="space-y-1 pb-2 border-b border-neutral-800">
            <h2 className="text-base font-semibold text-[color:var(--text-primary)]">Experience Settings</h2>
            <p className="text-xs text-[color:var(--text-secondary)]">Configure streaming and access control.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stream_url">Streaming Endpoint (HTTPS)</Label>
            <Input
              id="stream_url"
              value={values.stream_url}
              onChange={(e) => handleChange("stream_url", e.target.value)}
              placeholder="https://arc.stream/..."
              className="font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1.5">
                <Label>Visibility</Label>
                <div className="flex bg-neutral-900 rounded-md p-1 border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleChange("published", false)}
                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${!values.published ? 'bg-neutral-800 text-[color:var(--text-primary)]' : 'text-neutral-500 hover:text-neutral-400'}`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("published", true)}
                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${values.published ? 'bg-[color:var(--accent)] text-black' : 'text-neutral-500 hover:text-neutral-400'}`}
                  >
                    Live
                  </button>
                </div>
             </div>
             <div className="space-y-1.5">
                <Label>Auth Method</Label>
                <select 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-[color:var(--text-primary)] focus:border-[color:var(--accent)] outline-none"
                  value={values.auth_type}
                  onChange={(e) => handleChange("auth_type", e.target.value as AuthType)}
                >
                  <option value="public">Public Access</option>
                  <option value="password">Password Required</option>
                </select>
             </div>
          </div>
        </Card>

        {error && (
          <div className="rounded-md border border-red-500/20 bg-[color:var(--danger-soft)] px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/projects">
            <Button variant="ghost">Discard</Button>
          </Link>
          <Button type="submit" variant="primary" disabled={saving} className="min-w-[120px]">
            {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Project</>}
          </Button>
        </div>
      </form>

      {/* Sidebar preview/thumbnails */}
      <aside className="space-y-6">
        <Card className="p-4 space-y-4">
           <Label className="text-[10px] uppercase font-bold tracking-[0.2em]">Project Cover</Label>
           <div className="aspect-[4/3] rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden relative flex items-center justify-center">
              {values.thumbnail_dark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.thumbnail_dark} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Box className="h-8 w-8 text-neutral-800" />
              )}
           </div>
           <div className="space-y-1.5">
             <Label htmlFor="thumb_dark" className="text-xs">Dark Thumbnail URL</Label>
             <Input 
                id="thumb_dark"
                value={values.thumbnail_dark}
                onChange={(e) => handleChange("thumbnail_dark", e.target.value)}
                placeholder="https://..."
                className="h-8 text-[10px] font-mono"
             />
           </div>
        </Card>

        <section className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-4 space-y-3">
           <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
             <Check className="h-3 w-3" /> System Checks
           </h4>
           <div className="space-y-2">
              <div className={`flex items-center justify-between text-[10px] ${values.stream_url ? 'text-emerald-500' : 'text-neutral-600'}`}>
                <span>Stream Link</span>
                {values.stream_url ? <Check className="h-2.5 w-2.5" /> : '—'}
              </div>
              <div className={`flex items-center justify-between text-[10px] ${values.thumbnail_dark ? 'text-emerald-500' : 'text-neutral-600'}`}>
                <span>Cover Image</span>
                {values.thumbnail_dark ? <Check className="h-2.5 w-2.5" /> : '—'}
              </div>
              <div className={`flex items-center justify-between text-[10px] ${values.published ? 'text-[color:var(--accent)] font-bold' : 'text-neutral-600'}`}>
                <span>Production Live</span>
                {values.published ? <Check className="h-2.5 w-2.5" /> : '—'}
              </div>
           </div>
        </section>
      </aside>
    </div>
  );
}
