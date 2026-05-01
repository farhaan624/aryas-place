import type { Metadata } from "next";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wide text-sidebar-foreground">Dashboard</h1>
        <p className="text-sidebar-foreground/60 text-sm mt-1">Overview of your platform</p>
      </div>
      <AnalyticsCards />
    </div>
  );
}
