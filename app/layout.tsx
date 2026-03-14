import "@/styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Venus · Architectural Experiences",
  description:
    "Venus helps architecture studios present interactive experiences with beautiful, minimal project pages."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="page-shell antialiased">
        {children}
      </body>
    </html>
  );
}

