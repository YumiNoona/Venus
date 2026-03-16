"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button, Input, Label } from "@/components/ui"
import { Sparkles, ArrowRight } from "lucide-react"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { submitLead } from "@/lib/actions/leads"

interface LeadFormProps {
  projectId: string;
  onFinish?: () => void;
}

export function LeadForm({ projectId, onFinish }: LeadFormProps) {
  const [phone, setPhone] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function action(formData: FormData) {
    setError(null)
    
    // 1. Client-side phone validation
    if (phone && !isValidPhoneNumber(phone)) {
      setError("Please enter a valid phone number.")
      return
    }

    if (phone) formData.set("phone", phone)

    const result = await submitLead(formData)
    
    if (result.success) {
      setSuccess(true)
      if (onFinish) {
        // Delay slightly for success animation
        setTimeout(onFinish, 1500);
      }
    } else {
      setError(result.error || "Failed to send inquiry.")
    }
  }

  if (success) {
    return (
      <div className="p-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
           <Sparkles className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold">Inquiry Received</h3>
        <p className="text-sm text-text-secondary">Our studio team will contact you shortly.</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <input type="hidden" name="projectId" value={projectId} />
      
      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Full Name</Label>
        <Input name="name" placeholder="John Doe" required className="bg-bg-soft border-border focus:border-accent h-14 text-sm" />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Work Email</Label>
        <Input name="email" type="email" placeholder="john@example.com" required className="bg-bg-soft border-border focus:border-accent h-14 text-sm" />
      </div>

      <div className="space-y-2 md:col-span-2 inquiry-phone-input">
        <Label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-1">Phone Number (Optional)</Label>
        <PhoneInput
          defaultCountry="IN"
          value={phone}
          onChange={setPhone}
          className="phone-input-container"
          placeholder="+91 98765 43210"
        />
      </div>

      {error && (
        <div className="md:col-span-2 text-[10px] font-bold text-red-400 uppercase tracking-widest text-center py-2 bg-red-400/10 rounded-lg border border-red-400/20">
          {error}
        </div>
      )}

      <div className="md:col-span-2 pt-4">
         <SubmitButton />
         <p className="text-[10px] text-center text-text-secondary mt-6 tracking-widest uppercase">
            Confidentiality guaranteed.
         </p>
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full h-14 shadow-lg shadow-accent/10 font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:translate-y-[-2px]">
      {pending ? "Sending..." : "Send Inquiry"}
      {!pending && <ArrowRight className="ml-3 h-5 w-5" />}
    </Button>
  )
}
