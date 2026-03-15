"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Textarea, Label, Button, Card, Badge, Separator, Switch } from "@/components/ui";
import { slugify } from "@/lib/slugify";
import { ArrowLeft, Box, Check, Save, Upload, Cloud, Globe, Lock, AlertCircle, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import Link from "next/link";
import { saveProject } from "@/app/(studio)/projects/mutations";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

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
  remember_visitor: boolean;
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
    published: initial?.published ?? false,
    remember_visitor: initial?.remember_visitor ?? true
  });

  const [thumbnailLightFile, setThumbnailLightFile] = useState<File | null>(null);
  const [thumbnailDarkFile, setThumbnailDarkFile] = useState<File | null>(null);
  const [lightPreview, setLightPreview] = useState<string | null>(initial?.thumbnail_light ?? null);
  const [darkPreview, setDarkPreview] = useState<string | null>(initial?.thumbnail_dark ?? null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Validation Logic
  const isValid = !!(values.name && values.slug && values.stream_url && (lightPreview || thumbnailLightFile) && (darkPreview || thumbnailDarkFile));
  const isEdit = !!values.id;
  const isDirty = isEdit ? (
    values.name !== initial?.name ||
    values.slug !== initial?.slug ||
    values.short_description !== initial?.short_description ||
    values.long_description !== initial?.long_description ||
    values.stream_url !== initial?.stream_url ||
    values.auth_type !== initial?.auth_type ||
    values.password !== initial?.password ||
    values.published !== initial?.published ||
    values.remember_visitor !== initial?.remember_visitor ||
    !!thumbnailLightFile ||
    !!thumbnailDarkFile
  ) : true;

  const showSlugWarning = isEdit && values.slug !== initial?.slug;

  // Auto-Slug Logic
  const onNameChange = (name: string) => {
    setValues(prev => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name)
    }));
  };

  function handleChange(field: keyof ProjectFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field === "auth_type" && value === "password") {
       setTimeout(() => passwordRef.current?.focus(), 50);
    }
  }

  // Drag and Drop implementation
  const onDropLight = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setThumbnailLightFile(file);
      setLightPreview(URL.createObjectURL(file));
    }
  }, []);

  const onDropDark = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setThumbnailDarkFile(file);
      setDarkPreview(URL.createObjectURL(file));
    }
  }, []);

  const dropzoneLight = useDropzone({
    onDrop: onDropLight,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024
  });

  const dropzoneDark = useDropzone({
    onDrop: onDropDark,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple alert or toast could be added here
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange("password", pass);
  };

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
    const tempId = projectId || crypto.randomUUID();

    let updatedLightUrl = values.thumbnail_light;
    let updatedDarkUrl = values.thumbnail_dark;

    if (thumbnailLightFile) {
      const path = `${tempId}/light.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("project-thumbnails")
        .upload(path, thumbnailLightFile, { upsert: true });

      if (!uploadError) {
        updatedLightUrl = supabase.storage.from("project-thumbnails").getPublicUrl(path).data.publicUrl;
      }
    }

    if (thumbnailDarkFile) {
      const path = `${tempId}/dark.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("project-thumbnails")
        .upload(path, thumbnailDarkFile, { upsert: true });

      if (!uploadError) {
        updatedDarkUrl = supabase.storage.from("project-thumbnails").getPublicUrl(path).data.publicUrl;
      }
    }

    const payload = {
      id: projectId,
      name: values.name,
      slug: values.slug || slugify(values.name),
      thumbnail_light: updatedLightUrl || null,
      thumbnail_dark: updatedDarkUrl || null,
      short_description: values.short_description || null,
      long_description: values.long_description || null,
      stream_url: values.stream_url || null,
      auth_type: values.auth_type,
      password: values.auth_type === "password" ? values.password : null,
      published: values.published,
      remember_visitor: values.remember_visitor
    };

    const result = await saveProject(payload);

    setSaving(false);
    if (!result.success) {
      setError(result.error ?? "Failed to save project");
      return;
    }

    router.refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 animate-in fade-in duration-300 pb-20">
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
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Highland Residence"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={values.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="highland-residence"
                className="font-mono text-xs bg-neutral-900/50 border-neutral-800"
                required
              />
              {values.slug && (
                <p className="text-[10px] text-neutral-500 mt-1">
                  Project URL: <span className="text-[color:var(--accent)] font-bold">{values.slug}.{process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in'}</span>
                </p>
              )}
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
            <div className="relative">
              <Cloud className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <Input
                id="stream_url"
                value={values.stream_url}
                onChange={(e) => handleChange("stream_url", e.target.value)}
                placeholder="https://arc.stream/..."
                className="pl-10 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1.5">
                <Label>Visibility</Label>
                <div className="flex bg-neutral-900 rounded-md p-1 border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleChange("published", false)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors",
                      !values.published ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-400'
                    )}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("published", true)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors",
                      values.published ? 'bg-[color:var(--accent)] text-black' : 'text-neutral-500 hover:text-neutral-400'
                    )}
                  >
                    Live
                  </button>
                </div>
             </div>
              <div className="space-y-1.5">
                <Label>Auth Method</Label>
                <select 
                  className="w-full h-9 bg-neutral-900 border border-neutral-800 rounded-md px-3 text-xs text-[color:var(--text-primary)] focus:border-[color:var(--accent)] outline-none"
                  value={values.auth_type}
                  onChange={(e) => handleChange("auth_type", e.target.value as AuthType)}
                >
                  <option value="public">Public Access</option>
                  <option value="password">Password Required</option>
                  <option value="otp">OTP Verification</option>
                </select>
             </div>
          </div>

          <Separator className="bg-neutral-800/50" />

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
            <div className="space-y-1">
              <Label className="text-sm font-bold text-[color:var(--text-primary)]">Remember visitor session</Label>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                Returning visitors on the same device can re-enter without filling the form again. Recommended for better UX.
              </p>
            </div>
            <Switch 
              checked={values.remember_visitor} 
              onCheckedChange={(checked) => handleChange("remember_visitor", checked)} 
            />
          </div>

          {values.auth_type === "password" && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                   <Label htmlFor="password">Project Password</Label>
                   <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => copyToClipboard(values.password)}
                        className="text-[9px] uppercase font-bold text-neutral-500 hover:text-[color:var(--accent)] transition-colors flex items-center gap-1"
                      >
                        <Copy className="h-2.5 w-2.5" /> Copy
                      </button>
                      <button 
                        type="button" 
                        onClick={generatePassword}
                        className="text-[9px] uppercase font-bold text-neutral-500 hover:text-[color:var(--accent)] transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="h-2.5 w-2.5" /> Regenerate
                      </button>
                   </div>
                </div>
                <div className="relative">
                  <Input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Enter access password"
                    required
                    className="pr-20 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lg filter drop-shadow hover:scale-110 transition-transform"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 italic">
                  Visitors must enter this password to access the project experience.
                </p>
              </div>
            </div>
          )}
        </Card>

        {error && (
          <div className="rounded-md border border-red-500/20 bg-[color:var(--danger-soft)] px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </form>

      {/* Sidebar preview/thumbnails */}
      <aside className="space-y-6">
        <Card className="p-4 space-y-6 bg-neutral-900/40">
           <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-500">Project Covers</Label>
           
           <div className="space-y-6">
              {/* Light Theme Cover Dropzone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">Day Mode</Label>
                  {lightPreview && (
                    <button onClick={() => {setThumbnailLightFile(null); setLightPreview(null)}} className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400">Remove</button>
                  )}
                </div>
                <div 
                  {...dropzoneLight.getRootProps()} 
                  className={cn(
                    "aspect-[16/9] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group",
                    dropzoneLight.isDragActive ? "border-[color:var(--accent)] bg-[color:var(--accent)]/5" : "border-neutral-800 bg-black/40 hover:border-neutral-700",
                    lightPreview && "border-none"
                  )}
                >
                   <input {...dropzoneLight.getInputProps()} />
                   {lightPreview ? (
                      <>
                        <img src={lightPreview} alt="Light Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <Upload className="h-5 w-5 text-white" />
                        </div>
                      </>
                   ) : (
                      <div className="flex flex-col items-center text-center p-6 space-y-2">
                        <Upload className="h-6 w-6 text-neutral-700 group-hover:text-neutral-500" />
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-neutral-600">Drag & drop cover</p>
                        <p className="text-[8px] text-neutral-700">1920x1080 recommended</p>
                      </div>
                   )}
                </div>
              </div>

              {/* Dark Theme Cover Dropzone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-neutral-400 uppercase tracking-widest">Night Mode</Label>
                  {darkPreview && (
                    <button onClick={() => {setThumbnailDarkFile(null); setDarkPreview(null)}} className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400">Remove</button>
                  )}
                </div>
                <div 
                  {...dropzoneDark.getRootProps()} 
                  className={cn(
                    "aspect-[16/9] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group",
                    dropzoneDark.isDragActive ? "border-[color:var(--accent)] bg-[color:var(--accent)]/5" : "border-neutral-800 bg-black/40 hover:border-neutral-700",
                    darkPreview && "border-none"
                  )}
                >
                   <input {...dropzoneDark.getInputProps()} />
                   {darkPreview ? (
                      <>
                        <img src={darkPreview} alt="Dark Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <Upload className="h-5 w-5 text-white" />
                        </div>
                      </>
                   ) : (
                      <div className="flex flex-col items-center text-center p-6 space-y-2">
                        <Upload className="h-6 w-6 text-neutral-700 group-hover:text-neutral-500" />
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-neutral-600">Drag & drop cover</p>
                        <p className="text-[8px] text-neutral-700">1920x1080 recommended</p>
                      </div>
                   )}
                </div>
              </div>
           </div>
        </Card>

        {/* Dynamic Status Chips */}
        <section className="bg-neutral-900/40 rounded-xl border border-neutral-800 p-5 space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Project Integrity</h4>
           
           <div className="flex flex-wrap gap-2">
              {/* Stream Status */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tighter uppercase border",
                values.stream_url ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/5 border-red-500/10 text-red-400"
              )}>
                 <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", values.stream_url ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500")} />
                 {values.stream_url ? "Stream Connected" : "Stream Missing"}
              </div>

              {/* Media Status */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tighter uppercase border",
                (lightPreview && darkPreview) ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
              )}>
                 <div className={cn("h-1.5 w-1.5 rounded-full", (lightPreview && darkPreview) ? "bg-emerald-500" : "bg-amber-500")} />
                 {(lightPreview && darkPreview) ? "Covers Uploaded" : "Missing Visuals"}
              </div>

              {/* Publication Status */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tighter uppercase border",
                values.published ? "bg-[color:var(--accent)]/10 border-[color:var(--accent)]/20 text-[color:var(--accent)]" : "bg-neutral-800 border-neutral-700 text-neutral-400"
              )}>
                 {values.published ? (
                   <>
                     <Globe className="h-3 w-3" />
                     Project Live
                   </>
                 ) : (
                   <>
                     <Lock className="h-3 w-3" />
                     Draft Mode
                   </>
                 )}
              </div>
           </div>

            {( !values.stream_url || !lightPreview || !darkPreview ) && (
              <p className="text-[9px] text-neutral-600 flex items-start gap-1.5 leading-tight italic">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Some assets are missing. We recommend completing all fields for the best experience.
              </p>
            )}
 
             {showSlugWarning && (
               <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                 <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tight">URL Change Warning</p>
                   <p className="text-[10px] text-amber-200/70 leading-relaxed italic">
                     Modifying the slug will change the project's URL. Existing links shared with clients may stop working and will require redirection.
                   </p>
                 </div>
               </div>
             )}

            <Separator className="bg-neutral-800/40" />
            <div className="pt-2 space-y-4">
               {values.id && (
                 <Button 
                   type="button" 
                   variant="ghost" 
                   onClick={() => window.open(`/p/${values.slug}`, '_blank')}
                   className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A46C] border-[#C9A46C]/20 hover:bg-[#C9A46C]/5 h-11"
                 >
                   Preview Project
                 </Button>
               )}
               <Button 
                 onClick={(e) => handleSubmit(e as any)}
                 variant={saved ? "ghost" : "primary"} 
                 disabled={saving || !isValid || !isDirty} 
                 className={cn(
                   "w-full h-11 text-[11px] font-black uppercase tracking-[0.2em] transition-all",
                   saved && "border-emerald-500/50 text-emerald-500 bg-emerald-500/5"
                 )}
               >
                 {saving ? (
                   isEdit ? "Updating..." : "Uploading..."
                 ) : saved ? (
                   <><Check className="h-4 w-4 mr-2" /> {isEdit ? "Project Updated" : "Project Uploaded"}</>
                 ) : (
                   <><Save className="h-4 w-4 mr-2" /> {isEdit ? "Update Project" : "Upload Project"}</>
                 )}
               </Button>
               <Link href="/projects" className="block text-center pt-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors">Discard Changes</span>
               </Link>
            </div>
         </section>
      </aside>
    </div>
  );
}
