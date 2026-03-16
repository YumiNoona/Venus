"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Lock, Key, Mail, User, Phone, CheckCircle2 } from "lucide-react";
import { Button, Input, Label, Card } from "@/components/ui";
import { verifyProjectPassword } from "@/app/p/[slug]/actions";
import { submitLead } from "@/lib/actions/leads";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface ExperienceGateProps {
  projectId: string;
  projectName: string;
  slug: string;
  authType: "public" | "password" | "otp";
  rememberVisitor: boolean;
  streamUrl: string;
}

export function ExperienceGate({
  projectId,
  projectName,
  slug,
  authType,
  rememberVisitor,
  streamUrl
}: ExperienceGateProps) {
  const [step, setStep] = useState<"idle" | "gate" | "access">("idle");
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [password, setPassword] = useState("");

  const storageKey = `venus_access_${projectId}`;

  useEffect(() => {
    const access = localStorage.getItem(storageKey);
    if (rememberVisitor && access === "true") {
      setHasAccess(true);
    }
  }, [projectId, rememberVisitor, storageKey]);

  const handleEnterClick = () => {
    if (hasAccess) {
      handleAccessGranted();
    } else {
      setStep("gate");
    }
  };

  const handleAccessGranted = () => {
    setStep("access");
    if (rememberVisitor) {
      localStorage.setItem(storageKey, "true");
    }
    setTimeout(() => {
      window.open(streamUrl, "_blank");
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 1. Validate Phone
    if (phone && !isValidPhoneNumber(phone)) {
      setError("Invalid phone number");
      setIsSubmitting(false);
      return;
    }

    // 2. Auth Check (if required)
    if (authType === "password") {
      const authResult = await verifyProjectPassword(slug, password);
      if (!authResult.success) {
        setError(authResult.error || "Incorrect password");
        setIsSubmitting(false);
        return;
      }
    }

    // 3. Submit Lead
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("name", name);
    formData.append("email", email);
    if (phone) formData.append("phone", phone);

    const leadResult = await submitLead(formData);
    setIsSubmitting(false);

    if (leadResult.success) {
      handleAccessGranted();
    } else {
      setError(leadResult.error || "Failed to process identity");
    }
  };

  if (step === "idle") {
    return (
      <section id="immersive" className="relative p-12 lg:p-24 rounded-[32px] overflow-hidden bg-bg-soft border border-border flex flex-col items-center text-center space-y-10 group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-50" />
        <div className="relative space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-bg border border-border flex items-center justify-center mb-6 shadow-xl">
            <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-text">
            The Digital Atmosphere
          </h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Enter the fully immersive pixel-streamed experience. Walk through the spaces, experience materials, and feel the light in real-time.
          </p>
        </div>

        <Button 
          onClick={handleEnterClick}
          className="relative group/btn h-16 px-10 rounded-2xl bg-accent text-xs font-black uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent/20"
        >
          {hasAccess ? "Resume Experience" : "Enter Immersive Experience"}
          <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </section>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/80 backdrop-blur-xl animate-in fade-in duration-500 p-6">
      <Card className="w-full max-w-md bg-bg-soft border-border p-8 md:p-12 relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Decorative background */}
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {step === "gate" ? (
             <>
               <div className="text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-bg border border-border flex items-center justify-center mb-4">
                     <User className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase text-text">
                    Welcome Visitor
                  </h3>
                  <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">
                    Identity Verification
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-text-secondary ml-1">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
                        <Input 
                          placeholder="John Doe" 
                          required 
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="h-12 pl-10 bg-bg-soft border-border text-xs" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-text-secondary ml-1">Work Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
                        <Input 
                          type="email" 
                          placeholder="john@studio.com" 
                          required 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="h-12 pl-10 bg-bg-soft border-border text-xs" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 inquiry-phone-input">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-text-secondary ml-1">Phone Number</Label>
                      <PhoneInput
                        defaultCountry="IN"
                        value={phone}
                        onChange={setPhone}
                        className="phone-input-container bg-bg-soft border border-border rounded-md px-3 h-12 text-text"
                        placeholder="Enter phone"
                      />
                    </div>

                    {authType === "password" && (
                      <div className="space-y-1.5 pt-2 border-t border-border/50 mt-4">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-amber-500/80 ml-1">Protected Workspace Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-500/50" />
                          <Input 
                            type="password" 
                            placeholder="Set access password" 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="h-12 pl-10 bg-amber-500/5 border-amber-500/10 focus:border-amber-500/30 text-xs shadow-inner shadow-amber-500/5" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center bg-red-500/5 py-3 border border-red-500/10 rounded-lg">{error}</p>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-accent text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/10"
                  >
                    {isSubmitting ? "Verifying..." : "Continue to Experience"}
                  </Button>
               </form>

               <button 
                  onClick={() => setStep("idle")}
                  className="w-full text-[10px] uppercase font-bold text-text-secondary hover:text-text-secondary tracking-widest transition-colors pt-2"
                >
                  Cancel
               </button>
             </>
          ) : (
             <div className="text-center space-y-6 py-12 animate-in zoom-in-95 duration-500">
                <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                   <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-in spin-in-90 duration-700" />
                </div>
                <div className="space-y-1">
                   <h4 className="text-xl font-black uppercase italic tracking-tighter text-text">Access Granted</h4>
                   <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Opening internal stream...</p>
                </div>
                <div className="w-full max-w-[120px] mx-auto h-1 bg-border rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 animate-progress-fast" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary animate-pulse font-black italic">Launching Digital Atmosphere</p>
             </div>
          )}
        </div>
      </Card>
    </div>
  );
}
