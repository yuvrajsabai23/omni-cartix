"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Download, RefreshCw, Key, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/dashboard/downloads", icon: Download, label: "Downloads" },
  { href: "/dashboard/subscriptions", icon: RefreshCw, label: "Subscriptions" },
  { href: "/dashboard/licenses", icon: Key, label: "Licenses" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === href
              ? "bg-primary/20 text-primary"
              : "text-white/60 hover:text-white hover:bg-white/10"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
