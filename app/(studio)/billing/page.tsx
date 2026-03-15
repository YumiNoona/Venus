"use client";

import { useEffect, useState } from "react";
import { Card, Button, Badge, Progress, Label, Separator } from "@/components/ui";
import { CreditCard, Zap, Crown, Check, AlertCircle, Building2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import { updateSubscription, getSubscription } from "@/lib/actions/billing";
import { PLAN_FEATURES, type PlanType } from "@/lib/config/plans";

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function loadData() {
      const sub = await getSubscription();
      setSubscription(sub || { plan: 'free', credits: 1, projects_used: 0 });
      setLoading(false);
    }
    loadData();
  }, []);

  const handleUpgrade = async (planName: string) => {
    const planKey = planName.toLowerCase() as PlanType;
    if (subscription.plan === planKey) return;

    try {
      setLoading(true);
      await updateSubscription(planKey);
      window.location.reload();
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Upgrade failed. Please try again.");
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      credits: "10 Projects",
      features: ["Basic Stream Analytics", "Lead Export (CSV)", "Password Protection"],
      color: "border-neutral-800"
    },
    {
      name: "Studio",
      price: "$49",
      period: "/month",
      credits: "Unlimited Projects",
      features: ["Advanced Transitions", "OTP Verification", "PDF Report Generation", "Dedicated Support"],
      color: "border-[color:var(--accent)] shadow-xl shadow-[color:var(--accent)]/5",
      popular: true
    },
    {
      name: "Agency",
      price: "$99",
      period: "/month",
      credits: "Enterprise",
      features: ["Custom Domain Bind", "White-label Branding", "Multi-user Access", "API Access"],
      color: "border-neutral-800"
    }
  ];

  if (loading) return (
    <div className="p-8 animate-pulse space-y-8">
      <div className="h-8 w-48 bg-neutral-900 rounded" />
      <div className="h-64 w-full bg-neutral-900 rounded" />
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 pb-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Billing & Usage</h1>
        <p className="text-sm text-neutral-500 uppercase tracking-widest font-black">Manage your subscription and project credits</p>
      </header>

      {/* Current Usage Status */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-neutral-900/40 border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-1">
               <Label className="text-[10px] uppercase font-black text-neutral-500 tracking-[0.2em]">Active Plan</Label>
               <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight uppercase italic">{subscription.plan}</h2>
                  <Badge variant="accent" className="border-[color:var(--accent)]/30 text-[color:var(--accent)] bg-[color:var(--accent)]/5 text-[9px]">Active</Badge>
               </div>
            </div>
            <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">Next renewal: April 15, 2026</p>
         </Card>

         <Card className="p-6 bg-neutral-900/40 border-neutral-800 space-y-6 md:col-span-2">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-black text-neutral-500 tracking-[0.2em]">Project Usage</Label>
                  <h2 className="text-2xl font-black tracking-tight uppercase italic">{subscription.credits === Infinity ? 'Unlimited' : `${subscription.credits} Available`}</h2>
               </div>
               <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Usage: {subscription.projects_used} / {subscription.credits === Infinity ? '∞' : subscription.credits}</p>
            </div>
            <Progress value={subscription.credits === Infinity ? 0 : (subscription.projects_used/subscription.credits)*100} className="h-1.5" />
         </Card>
      </section>

      {/* Plans Section */}
      <section className="space-y-8">
         <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight uppercase italic">Upgrade Membership</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Scale your studio presence with professional features</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
               <Card key={plan.name} className={cn("p-8 bg-neutral-900/20 backdrop-blur-xl relative flex flex-col justify-between group transition-all hover:translate-y-[-4px]", plan.color)}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[color:var(--accent)] text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                       Most Popular
                    </div>
                  )}
                  
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase italic tracking-tight">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                           <span className="text-3xl font-black">{plan.price}</span>
                           <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{plan.period}</span>
                        </div>
                     </div>

                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-[color:var(--accent)] uppercase tracking-widest">{plan.credits}</p>
                        <Separator className="bg-neutral-800" />
                     </div>

                     <ul className="space-y-3">
                        {plan.features.map(feat => (
                           <li key={feat} className="flex items-start gap-3 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter leading-tight">
                              <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                              {feat}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <Button 
                    variant={plan.popular ? "primary" : "ghost"} 
                    className={cn(
                      "w-full mt-8 h-12 text-[10px] font-black uppercase tracking-[0.2em]",
                      !plan.popular && "border-neutral-800"
                    )}
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={subscription.plan === plan.name.toLowerCase()}
                  >
                    {subscription.plan === plan.name.toLowerCase() ? "Current Plan" : `Select ${plan.name}`}
                  </Button>
               </Card>
            ))}
         </div>
      </section>

      {/* Credit Info */}
      <footer className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex items-start gap-4">
         <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
         <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">How credits work</h4>
            <p className="text-[10px] text-neutral-500 leading-relaxed font-bold uppercase tracking-tight">
               Each active project consumes 1 credit. Uploading thumbnails or changing stream endpoints does not cost extra. Credits renew at the start of your billing cycle.
            </p>
         </div>
      </footer>
    </div>
  );
}
