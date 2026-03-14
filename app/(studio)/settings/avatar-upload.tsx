"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProfile } from "./actions";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
}

export function AvatarUpload({ userId, currentAvatarUrl }: AvatarUploadProps) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserSupabaseClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert("Avatar must be under 2MB");
        return;
      }

      console.log("File object selected:", file);

      setIsUploading(true);

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/avatar.jpg`, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600"
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${userId}/avatar.jpg`);

      // 3. Store versioned URL in DB to prevent caching issues
      const versionedUrl = `${publicUrl}?v=${Date.now()}`;
      await updateProfile({ avatar_url: versionedUrl });
      
      setAvatarUrl(versionedUrl);
      router.refresh();
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(`Failed to upload avatar: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-neutral-800 bg-neutral-900 flex items-center justify-center transition-all group-hover:border-[color:var(--accent)] shadow-xl">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="h-full w-full object-cover transition-opacity group-hover:opacity-40" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-600 transition-opacity group-hover:opacity-40">
              <Camera className="h-8 w-8" />
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-[color:var(--accent)] animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>
        </div>

        {isUploading && (
           <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
           </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*"
        capture="user"
      />
      
      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
        Click to update avatar
      </p>
    </div>
  );
}
