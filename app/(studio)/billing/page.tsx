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
      color: "border-border"
    },
    {
      name: "Studio",
      price: "$49",
      period: "/month",
      credits: "Unlimited Projects",
      features: ["Advanced Transitions", "OTP Verification", "PDF Report Generation", "Dedicated Support"],
      color: "border-accent shadow-xl shadow-accent/10",
      popular: true
    },
    {
      name: "Agency",
      price: "$99",
      period: "/month",
      credits: "Enterprise",
      features: ["Custom Domain Bind", "White-label Branding", "Multi-user Access", "API Access"],
      color: "border-border"
    }
  ];

  if (loading) return (
    <div className="p-8 animate-pulse space-y-8">
      <div className="h-8 w-48 bg-bg-soft rounded" />
      <div className="h-64 w-full bg-bg-soft rounded" />
    </div>
  );

  return (
    <div className="page-container space-y-12 pb-20 px-4">
      <header className="space-y-1 px-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Usage</h1>
        <p className="text-sm text-muted-foreground">Manage your subscription and project credits</p>
      </header>

      {/* Current Usage Status */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-muted/20 border-border flex flex-col justify-between space-y-6">
            <div className="space-y-1.5">
               <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Active Plan</Label>
                <div className="flex items-center gap-2">
                   <h2 className="text-xl font-bold tracking-tight text-foreground capitalize">{subscription.plan}</h2>
                   <Badge variant="accent" className="h-5 px-2 text-[9px] rounded-full border-primary/20 bg-primary/5 text-primary">Active</Badge>
                </div>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Next renewal: April 15, 2026</p>
         </Card>

         <Card className="p-6 bg-muted/20 border-border space-y-6 md:col-span-2">
            <div className="flex justify-between items-end">
                <div className="space-y-1.5">
                   <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project Usage</Label>
                   <h2 className="text-xl font-bold tracking-tight text-foreground">{subscription.credits === Infinity ? 'Unlimited' : `${subscription.credits} Available`}</h2>
                </div>
               <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Usage: {subscription.projects_used} / {subscription.credits === Infinity ? '∞' : subscription.credits}</p>
            </div>
            <Progress value={subscription.credits === Infinity ? 0 : (subscription.projects_used/subscription.credits)*100} className="h-1 bg-muted" />
         </Card>
      </section>

      {/* Plans Section */}
      <section className="space-y-8">
         <div className="space-y-1 px-1">
            <h2 className="text-lg font-bold tracking-tight text-foreground text-center md:text-left">Upgrade Membership</h2>
            <p className="text-sm text-muted-foreground text-center md:text-left">Scale your studio presence with professional features</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {plans.map((plan) => (
               <Card key={plan.name} className={cn(
                 "p-8 bg-card border-border relative flex flex-col justify-between transition-all duration-300 hover:border-foreground/20 hover:shadow-2xl hover:shadow-black/5",
                 plan.popular && "border-foreground/20 ring-1 ring-foreground/20"
               )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg z-10">
                       Most Popular
                    </div>
                  )}
                  
                  <div className="space-y-8">
                     <div className="space-y-1">
                        <h3 className="text-lg font-bold tracking-tight text-foreground">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                           <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                           <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{plan.period}</span>
                        </div>
                     </div>
 
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">{plan.credits}</p>
                        <Separator className="bg-border opacity-100" />
                     </div>

                     <ul className="space-y-4">
                        {plan.features.map(feat => (
                           <li key={feat} className="flex items-start gap-3 text-xs font-medium text-muted-foreground leading-tight">
                              <Check className="h-3.5 w-3.5 text-foreground shrink-0 mt-0.5" />
                              {feat}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <Button 
                    variant={plan.popular ? "primary" : "outline"} 
                    className={cn(
                      "w-full mt-10 h-11 text-xs font-bold transition-all",
                      !plan.popular && "border-border hover:bg-muted"
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
      <footer className="bg-muted/30 border border-border rounded-xl p-6 flex items-start gap-4">
         <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
         <div className="space-y-1">
            <h4 className="text-sm font-bold tracking-tight text-foreground">How credits work</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
               Each active project consumes 1 credit. Uploading thumbnails or changing stream endpoints does not cost extra. Credits renew at the start of your billing cycle.
            </p>
         </div>
      </footer>
    </div>
  );
}
