export type PlanType = "free" | "starter" | "studio" | "agency";

export interface PlanFeatures {
  projects: number;
  otp_auth: boolean;
  csv_export: boolean;
  pdf_export: boolean;
  white_label: boolean;
  ads: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    projects: 1,
    otp_auth: false,
    csv_export: false,
    pdf_export: false,
    white_label: false,
    ads: true,
  },
  starter: {
    projects: 10,
    otp_auth: false,
    csv_export: true,
    pdf_export: false,
    white_label: false,
    ads: false,
  },
  studio: {
    projects: Infinity,
    otp_auth: true,
    csv_export: true,
    pdf_export: true,
    white_label: false,
    ads: false,
  },
  agency: {
    projects: Infinity,
    otp_auth: true,
    csv_export: true,
    pdf_export: true,
    white_label: true,
    ads: false,
  },
};
