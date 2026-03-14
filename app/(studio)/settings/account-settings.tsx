"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { 
  Card, 
  Button, 
  Input, 
  Label, 
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { AvatarUpload } from "./avatar-upload";
import { updateProfile, signOutOthers, deleteAccount } from "./actions";
import { ShieldCheck, LogOut, Trash2, AlertTriangle, Key, Mail, User } from "lucide-react";

interface AccountSettingsProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    name: string;
    email: string;
    avatar_url: string;
  };
}

export function AccountSettings({ user, profile }: AccountSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteTimer, setDeleteTimer] = useState(0);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const supabase = createBrowserSupabaseClient();

  // Handle 3-second delete delay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (deleteConfirm === "DELETE" && deleteTimer > 0) {
      interval = setInterval(() => {
        setDeleteTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [deleteConfirm, deleteTimer]);

  useEffect(() => {
    if (deleteConfirm === "DELETE") {
      setDeleteTimer(3);
    } else {
      setDeleteTimer(0);
    }
  }, [deleteConfirm]);

  const handleUpdateName = async () => {
    setIsLoading("name");
    try {
      await updateProfile({ name });
      setMessage({ type: 'success', text: "Name updated successfully" });
    } catch (e) {
      setMessage({ type: 'error', text: "Failed to update name" });
    } finally {
      setIsLoading(null);
    }
  };

  const handleUpdateEmail = async () => {
    setIsLoading("email");
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMessage({ type: 'success', text: "Verification email sent to new address" });
    } catch (e) {
      setMessage({ type: 'error', text: "Failed to trigger email update" });
    } finally {
      setIsLoading(null);
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match" });
      return;
    }
    setIsLoading("password");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ type: 'success', text: "Password updated successfully" });
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setMessage({ type: 'error', text: "Failed to update password" });
    } finally {
      setIsLoading(null);
    }
  };

  const handleSignOutOthers = async () => {
    setIsLoading("sessions");
    try {
      await signOutOthers();
      setMessage({ type: 'success', text: "All other sessions signed out" });
    } catch (e) {
      setMessage({ type: 'error', text: "Failed to sign out other sessions" });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {message && (
        <div className={cn(
          "p-3 rounded-lg text-xs font-medium text-center animate-in fade-in slide-in-from-top-1",
          message.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
        )}>
          {message.text}
        </div>
      )}

      {/* Identity Section */}
      <section className="space-y-6">
        <div className="flex flex-col items-center gap-6">
          <AvatarUpload userId={user.id} currentAvatarUrl={profile.avatar_url} />
          
          <div className="w-full space-y-4">
             <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Full Name</Label>
                <div className="flex gap-2">
                   <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 bg-neutral-900 border-neutral-800"
                      />
                   </div>
                   <Button 
                    size="md" 
                    variant="primary" 
                    disabled={name === profile.name || isLoading === "name"}
                    onClick={handleUpdateName}
                    isLoading={isLoading === "name"}
                   >
                     Save
                   </Button>
                </div>
             </div>

             <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Email Address</Label>
                <div className="flex gap-2">
                   <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <Input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-neutral-900 border-neutral-800"
                      />
                   </div>
                   <Button 
                    size="md" 
                    variant="secondary" 
                    disabled={email === profile.email || isLoading === "email"}
                    onClick={handleUpdateEmail}
                    isLoading={isLoading === "email"}
                   >
                     Update
                   </Button>
                </div>
                <p className="text-[10px] text-neutral-600">You will need to verify the new email address.</p>
             </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Security Section */}
      <section className="space-y-6">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-neutral-500" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Security</h3>
           </div>
           
           <Card className="p-6 space-y-6 bg-neutral-900/50 border-neutral-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">New Password</Label>
                    <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-neutral-950 border-neutral-800"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Confirm Password</Label>
                    <Input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-neutral-950 border-neutral-800"
                    />
                 </div>
              </div>
              <Button 
                variant="primary" 
                className="w-full" 
                disabled={!password || password !== confirmPassword || isLoading === "password"}
                onClick={handleChangePassword}
                isLoading={isLoading === "password"}
              >
                Change Password
              </Button>
           </Card>

           <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900/30">
              <div className="space-y-0.5">
                 <p className="text-xs font-semibold text-[color:var(--text-primary)]">Browser Sessions</p>
                 <p className="text-[10px] text-neutral-500">Log out of all other devices currently active.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-red-500 hover:bg-red-500/5"
                onClick={handleSignOutOthers}
                isLoading={isLoading === "sessions"}
              >
                 <LogOut className="h-3 w-3" />
                 Sign out others
              </Button>
           </div>
        </div>
      </section>

      <Separator />

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
           <AlertTriangle className="h-4 w-4 text-red-500/50" />
           <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500/50">Danger Zone</h3>
        </div>
        
        <Dialog>
           <DialogTrigger asChild>
              <Button variant="danger" className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
           </DialogTrigger>
            <DialogContent className="max-w-md bg-neutral-950 border-red-900/30">
               <DialogHeader className="space-y-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 text-red-500 mx-auto">
                     <Trash2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 text-center">
                     <DialogTitle className="text-lg font-bold text-red-500">Irreversible Action</DialogTitle>
                     <DialogDescription className="text-xs text-neutral-500 leading-relaxed px-4">
                        Deleting your account will permanently remove all your architectural projects, leads, and assets. This cannot be undone.
                     </DialogDescription>
                  </div>
               </DialogHeader>
                 
                 <div className="space-y-2 pt-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-red-500/60 block text-center">Type DELETE to confirm</Label>
                    <Input 
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="DELETE"
                        className="text-center h-12 border-red-900/20 bg-red-900/5 focus:border-red-500"
                    />
                 </div>
                                  <Button 
                    variant="danger" 
                    className="w-full h-12 text-white bg-red-600 hover:bg-red-500"
                    disabled={deleteConfirm !== "DELETE" || deleteTimer > 0 || isLoading === "delete"}
                    isLoading={isLoading === "delete"}
                    onClick={async () => {
                        setIsLoading("delete");
                        await deleteAccount();
                    }}
                 >
                    {deleteTimer > 0 ? `Wait ${deleteTimer}s...` : "Permanently Delete"}
                 </Button>
            </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
