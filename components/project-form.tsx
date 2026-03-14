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

  const [thumbnailLightFile, setThumbnailLightFile] = useState<File | null>(null);
  const [thumbnailDarkFile, setThumbnailDarkFile] = useState<File | null>(null);
  const [lightPreview, setLightPreview] = useState<string | null>(initial?.thumbnail_light ?? null);
  const [darkPreview, setDarkPreview] = useState<string | null>(initial?.thumbnail_dark ?? null);

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

  function handleFileChange(theme: "light" | "dark", file: File | null) {
    if (file && file.size > 2 * 1024 * 1024) {
      setError(`${theme === "light" ? "Light" : "Dark"} cover must be under 2MB`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (theme === "light") {
        setThumbnailLightFile(file);
        setLightPreview(reader.result as string);
      } else {
        setThumbnailDarkFile(file);
        setDarkPreview(reader.result as string);
      }
    };
    if (file) reader.readAsDataURL(file);
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

    let projectId = values.id;

    // 1. If new project, insert first to get ID
    if (!projectId) {
      const { data, error } = await (supabase as any)
        .from("projects")
        .insert({
          user_id: userId,
          name: values.name,
          slug: values.slug || slugify(values.name),
          short_description: values.short_description || null,
          long_description: values.long_description || null,
          stream_url: values.stream_url || null,
          auth_type: values.auth_type,
          password: values.auth_type === "password" ? values.password : null,
          published: values.published
        })
        .select()
        .single();

      if (error) {
        setSaving(false);
        setError(error.message);
        return;
      }
      projectId = data.id;
    }

    // 2. Upload thumbnails if files selected
    let updatedLightUrl = values.thumbnail_light;
    let updatedDarkUrl = values.thumbnail_dark;

    if (thumbnailLightFile) {
      const path = `${projectId}/light.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("project-thumbnails")
        .upload(path, thumbnailLightFile, { upsert: true });

      if (uploadError) {
        console.error("Light upload error:", uploadError);
      } else {
        updatedLightUrl = supabase.storage.from("project-thumbnails").getPublicUrl(path).data.publicUrl;
      }
    }

    if (thumbnailDarkFile) {
      const path = `${projectId}/dark.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("project-thumbnails")
        .upload(path, thumbnailDarkFile, { upsert: true });

      if (uploadError) {
        console.error("Dark upload error:", uploadError);
      } else {
        updatedDarkUrl = supabase.storage.from("project-thumbnails").getPublicUrl(path).data.publicUrl;
      }
    }

    // 3. Update project with final payload (including new URLs if any)
    const payload = {
      name: values.name,
      slug: values.slug || slugify(values.name),
      thumbnail_light: updatedLightUrl || null,
      thumbnail_dark: updatedDarkUrl || null,
      short_description: values.short_description || null,
      long_description: values.long_description || null,
      stream_url: values.stream_url || null,
      auth_type: values.auth_type,
      password: values.auth_type === "password" ? values.password : null,
      published: values.published
    };

    const { error: updateError } = await (supabase as any)
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .eq("user_id", userId);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
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
        <Card className="p-4 space-y-6">
           <Label className="text-[10px] uppercase font-bold tracking-[0.2em]">Project Covers</Label>
           
           <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-500 uppercase tracking-widest">Light Theme Cover</Label>
                <div className="aspect-[16/9] rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden relative group">
                   {lightPreview ? (
                      <img src={lightPreview} alt="Light Preview" className="h-full w-full object-cover" />
                   ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Box className="h-6 w-6 text-neutral-800" />
                      </div>
                   )}
                   <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] uppercase font-bold text-white tracking-widest">Upload Light</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange("light", e.target.files?.[0] || null)}
                      />
                   </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-500 uppercase tracking-widest">Dark Theme Cover</Label>
                <div className="aspect-[16/9] rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden relative group">
                   {darkPreview ? (
                      <img src={darkPreview} alt="Dark Preview" className="h-full w-full object-cover" />
                   ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Box className="h-6 w-6 text-neutral-800" />
                      </div>
                   )}
                   <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] uppercase font-bold text-white tracking-widest">Upload Dark</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange("dark", e.target.files?.[0] || null)}
                      />
                   </label>
                </div>
              </div>
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
              <div className={`flex items-center justify-between text-[10px] ${lightPreview && darkPreview ? 'text-emerald-500' : 'text-neutral-600'}`}>
                <span>Covers Ready</span>
                {lightPreview && darkPreview ? <Check className="h-2.5 w-2.5" /> : '—'}
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
