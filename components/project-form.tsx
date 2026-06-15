"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Input, Textarea, Label, Button, Card, Badge, Separator, Switch } from "@/components/ui";
import { slugify } from "@/lib/slugify";
import { Check, Save, Upload, Cloud, Globe, Lock, AlertCircle, Copy, RefreshCw } from "lucide-react";
import Link from "next/link";
import { saveProject } from "@/app/(studio)/projects/mutations";
import { addCustomDomainToVercel, removeCustomDomainFromVercel, verifyDomainStatus } from "@/lib/actions/domains";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

type AuthType = "public" | "password" | "otp";

export interface ProjectFormValues {
  id?: string;
  name: string;
  slug: string;
  custom_domain: string;
  thumbnail_light: string;
  thumbnail_dark: string;
  short_description: string;
  long_description: string;
  stream_url: string;
  auth_type: AuthType;
  password: string;
  published: boolean;
  theme: string;
  remember_visitor: boolean;
  location: string;
  architect: string;
  area: string;
  year: string;
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
    custom_domain: initial?.custom_domain ?? "",
    thumbnail_light: initial?.thumbnail_light ?? "",
    thumbnail_dark: initial?.thumbnail_dark ?? "",
    short_description: initial?.short_description ?? "",
    long_description: initial?.long_description ?? "",
    stream_url: initial?.stream_url ?? "",
    auth_type: (initial?.auth_type as AuthType) ?? "public",
    password: initial?.password ?? "",
    published: initial?.published ?? false,
    theme: initial?.theme ?? "minimal",
    remember_visitor: initial?.remember_visitor ?? true,
    location: initial?.location ?? "",
    architect: initial?.architect ?? "",
    area: initial?.area ?? "",
    year: initial?.year ?? ""
  });

  const [thumbnailLightFile, setThumbnailLightFile] = useState<File | null>(null);
  const [thumbnailDarkFile, setThumbnailDarkFile] = useState<File | null>(null);
  const [lightPreview, setLightPreview] = useState<string | null>(initial?.thumbnail_light ?? null);
  const [darkPreview, setDarkPreview] = useState<string | null>(initial?.thumbnail_dark ?? null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'idle' | 'verifying' | 'active' | 'error'>('idle');
  const [domainError, setDomainError] = useState<string | null>(null);
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
    values.custom_domain !== initial?.custom_domain ||
    values.location !== initial?.location ||
    values.architect !== initial?.architect ||
    values.area !== initial?.area ||
    values.year !== initial?.year ||
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

  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Drag and Drop implementation
  const onDropLight = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setThumbnailLightFile(file);
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setLightPreview(url);
    }
  }, []);

  const onDropDark = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setThumbnailDarkFile(file);
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setDarkPreview(url);
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
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    let pass = "";
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(array[i] % chars.length);
    }
    handleChange("password", pass);
  };

  const handleVerifyDomain = async () => {
    if (!values.custom_domain) return;
    setDomainStatus('verifying');
    setDomainError(null);
    const res = await verifyDomainStatus(values.custom_domain);
    if (res.success && res.data?.verified) {
       setDomainStatus('active');
    } else {
       setDomainStatus('error');
       setDomainError(res.error || "DNS records not detected yet. Could take a few minutes.");
    }
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
    if (!projectId) projectId = tempId;

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
      custom_domain: values.custom_domain || null,
      thumbnail_light: updatedLightUrl || null,
      thumbnail_dark: updatedDarkUrl || null,
      short_description: values.short_description || null,
      long_description: values.long_description || null,
      stream_url: values.stream_url || null,
      auth_type: values.auth_type,
      password: values.auth_type === "password" ? values.password : null,
      published: values.published,
      theme: values.theme,
      remember_visitor: values.remember_visitor,
      location: values.location || null,
      architect: values.architect || null,
      area: values.area || null,
      year: values.year || null
    };

    // Handle Vercel Domain API Sync
    if (isEdit && values.custom_domain !== initial?.custom_domain) {
      if (initial?.custom_domain) {
        // Remove old domain
        await removeCustomDomainFromVercel(initial.custom_domain);
      }
      if (values.custom_domain) {
        // Add new domain
        const vRes = await addCustomDomainToVercel(values.custom_domain);
        if (!vRes.success) {
           setError(`Vercel Domain Sync Failed: ${vRes.error}`);
           setSaving(false);
           return;
        }
      }
    }

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
          <div className="space-y-1 pb-2 border-b border-border">
            <h2 className="text-base font-semibold text-text">Core Details</h2>
            <p className="text-xs text-text-secondary">The primary identity of your project.</p>
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
                className="font-mono text-xs bg-bg-soft border-border"
                required
              />
              {values.slug && (
                <p className="text-[10px] text-text-secondary mt-1">
                  Project URL: <span className="text-accent font-bold">{values.slug}.{process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in'}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="custom_domain">Custom Domain (Optional)</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
                  <Input
                    id="custom_domain"
                    value={values.custom_domain}
                    onChange={(e) => handleChange("custom_domain", e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
                    placeholder="experience.yourdomain.com"
                    className="pl-10 font-mono text-xs bg-bg-soft border-border"
                  />
                </div>
                {values.custom_domain && isEdit && (
                  <Button 
                    type="button" 
                    onClick={handleVerifyDomain} 
                    variant="outline" 
                    className="h-9 px-3 text-xs"
                    disabled={domainStatus === 'verifying'}
                  >
                    {domainStatus === 'verifying' ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                    Verify DNS
                  </Button>
                )}
              </div>
            </div>

            {values.custom_domain && (
               <div className="p-4 rounded-lg bg-bg-soft border border-border space-y-3">
                 <div className="flex items-center justify-between">
                   <p className="text-xs text-text-secondary font-medium tracking-tight">To connect your domain, configure this DNS record:</p>
                   {domainStatus === 'active' && <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10"><Check className="h-3 w-3 mr-1"/> Active</Badge>}
                   {domainStatus === 'error' && <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/20">DNS Error</Badge>}
                 </div>
                 
                 <div className="flex items-center gap-4 bg-bg rounded-md p-3 border border-border/50">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-bold text-text-secondary">Type</p>
                       <p className="text-xs font-mono text-text">CNAME</p>
                    </div>
                    <div className="space-y-1 flex-1">
                       <p className="text-[10px] uppercase font-bold text-text-secondary">Name</p>
                       <p className="text-xs font-mono text-text max-w-[120px] truncate">{values.custom_domain.split('.')[0] || '@'}</p>
                    </div>
                    <div className="space-y-1 flex-[2]">
                       <p className="text-[10px] uppercase font-bold text-text-secondary">Value</p>
                       <div className="flex items-center gap-2">
                         <p className="text-xs font-mono text-text">cname.vercel-dns.com</p>
                         <button type="button" onClick={() => copyToClipboard('cname.vercel-dns.com')} className="text-text-secondary hover:text-text-primary transition-colors">
                            <Copy className="h-3 w-3" />
                         </button>
                       </div>
                    </div>
                 </div>
                 {domainError && <p className="text-[10px] text-red-400 mt-2">{domainError}</p>}
                 {values.custom_domain !== initial?.custom_domain && (
                   <p className="text-[10px] text-amber-500 italic mt-2">
                      <AlertCircle className="h-3 w-3 inline mr-1 mb-0.5" />
                      You must save the project before Vercel will attempt to verify your domain.
                   </p>
                 )}
               </div>
            )}
          </div>

          <div className="space-y-1.5 pt-4">
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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("long_description", e.target.value)}
              placeholder="Tell the story of this architectural achievement..."
              rows={8}
            />
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="space-y-1 pb-2 border-b border-border">
            <h2 className="text-base font-semibold text-text">About Project</h2>
            <p className="text-xs text-text-secondary">Technical overview details displayed on the public page.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={values.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Modern Valley, CA"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="architect">Architect / Firm</Label>
              <Input
                id="architect"
                value={values.architect}
                onChange={(e) => handleChange("architect", e.target.value)}
                placeholder="Venus Design Studio"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area">Area / Size</Label>
              <Input
                id="area"
                value={values.area}
                onChange={(e) => handleChange("area", e.target.value)}
                placeholder="4,200 sq.ft"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Completion Year</Label>
              <Input
                id="year"
                value={values.year}
                onChange={(e) => handleChange("year", e.target.value)}
                placeholder="2024"
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="space-y-1 pb-2 border-b border-border">
            <h2 className="text-base font-semibold text-text">Experience Settings</h2>
            <p className="text-xs text-text-secondary">Configure streaming and access control.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stream_url">Streaming Endpoint (HTTPS)</Label>
            <div className="relative">
              <Cloud className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
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
                <div className="flex bg-bg-soft rounded-md p-1 border border-border">
                  <button
                    type="button"
                    onClick={() => handleChange("published", false)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors",
                      !values.published ? 'bg-border text-text' : 'text-text-secondary hover:text-text'
                    )}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("published", true)}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors",
                      values.published ? 'bg-accent text-white' : 'text-text-secondary hover:text-text'
                    )}
                  >
                    Live
                  </button>
                </div>
             </div>
              <div className="space-y-1.5">
                <Label>Auth Method</Label>
                <select 
                  className="w-full h-9 bg-bg-soft border border-border rounded-md px-3 text-xs text-text focus:border-accent outline-none"
                  value={values.auth_type}
                  onChange={(e) => handleChange("auth_type", e.target.value as AuthType)}
                >
                  <option value="public">Public Access</option>
                  <option value="password">Password Required</option>
                  <option value="otp">OTP Verification</option>
                </select>
             </div>
          </div>

          <div className="space-y-1.5">
            <Label>Presentation Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {['minimal', 'glass', 'architect'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange("theme", t)}
                  className={cn(
                    "px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all",
                    values.theme === t 
                      ? "bg-primary border-primary text-bg shadow-lg shadow-primary/20" 
                      : "bg-bg-soft border-border text-text-secondary hover:border-text-secondary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-bg-soft">
             <div className="space-y-1">
              <Label className="text-sm font-bold text-text">Remember visitor session</Label>
              <p className="text-[10px] text-text-secondary leading-relaxed font-medium">
                Returning visitors on the same device can re-enter without filling the form again. Recommended for better UX.
              </p>
            </div>
            <Switch 
              checked={values.remember_visitor} 
              onCheckedChange={(checked: boolean) => handleChange("remember_visitor", checked)} 
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
                        className="text-[9px] uppercase font-bold text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <Copy className="h-2.5 w-2.5" /> Copy
                      </button>
                      <button 
                        type="button" 
                        onClick={generatePassword}
                        className="text-[9px] uppercase font-bold text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
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
                <p className="text-[10px] text-text-secondary italic">
                  Visitors must enter this password to access the project experience.
                </p>
              </div>
            </div>
          )}
        </Card>

        {error && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
      </form>

      {/* Sidebar preview/thumbnails */}
      <aside className="space-y-6">
        <Card className="p-4 space-y-6 bg-bg-soft">
           <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-secondary">Project Covers</Label>
           
           <div className="space-y-6">
              {/* Light Theme Cover Dropzone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-text-secondary uppercase tracking-widest">Day Mode</Label>
                  {lightPreview && (
                    <button onClick={() => {setThumbnailLightFile(null); setLightPreview(null)}} className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400">Remove</button>
                  )}
                </div>
                <div 
                  {...dropzoneLight.getRootProps()} 
                  className={cn(
                    "aspect-[16/9] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group",
                    dropzoneLight.isDragActive ? "border-accent bg-accent/5" : "border-border bg-bg hover:border-text-secondary",
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
                        <Upload className="h-6 w-6 text-text-secondary group-hover:text-text" />
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary">Drag & drop cover</p>
                        <p className="text-[8px] text-text-secondary">1920x1080 recommended</p>
                      </div>
                   )}
                </div>
              </div>

              {/* Dark Theme Cover Dropzone */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-text-secondary uppercase tracking-widest">Night Mode</Label>
                  {darkPreview && (
                    <button onClick={() => {setThumbnailDarkFile(null); setDarkPreview(null)}} className="text-[9px] uppercase font-bold text-red-500 hover:text-red-400">Remove</button>
                  )}
                </div>
                <div 
                  {...dropzoneDark.getRootProps()} 
                  className={cn(
                    "aspect-[16/9] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group",
                    dropzoneDark.isDragActive ? "border-accent bg-accent/5" : "border-border bg-bg hover:border-text-secondary",
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
                        <Upload className="h-6 w-6 text-text-secondary group-hover:text-text" />
                        <p className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary">Drag & drop cover</p>
                        <p className="text-[8px] text-text-secondary">1920x1080 recommended</p>
                      </div>
                   )}
                </div>
              </div>
           </div>
        </Card>

        {/* Dynamic Status Chips */}
        <section className="bg-bg-soft rounded-xl border border-border p-5 space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Project Integrity</h4>
           
           <div className="flex flex-wrap gap-2">
              {/* Stream Status */}
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tighter uppercase border",
                values.stream_url ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/5 border-red-500/10 text-red-500"
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
                values.published ? "bg-accent/10 border-accent/20 text-accent" : "bg-bg border-border text-text-secondary"
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
              <p className="text-[9px] text-text-secondary flex items-start gap-1.5 leading-tight italic">
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
                          <Separator className="bg-border/50" />
            <div className="pt-2 space-y-4">
               {values.id && (
                 <>
                   <Button
                       type="button"
                       variant="ghost"
                       onClick={() => {
                           const url = `${values.slug}.${process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in'}`;
                           copyToClipboard(`https://${url}`);
                       }}
                       className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary border-border hover:bg-bg-soft hover:text-text h-10"
                     >
                       <Copy className="h-3 w-3 mr-2" /> Copy Project Link
                   </Button>
                   <Button
                       type="button"
                       variant="ghost"
                       onClick={() => window.open(`https://${values.slug}.${process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'venusapp.in'}`, '_blank')}
                       className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A46C] border-[#C9A46C]/20 hover:bg-[#C9A46C]/5 h-11"
                     >
                       View Live Page
                   </Button>
                 </>
               )}
                <Button
                  type="submit"
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
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-secondary transition-colors">Discard Changes</span>
               </Link>
            </div>
         </section>
      </aside>
    </div>
  );
}
