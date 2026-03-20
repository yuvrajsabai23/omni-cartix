import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Subscriptions" };

const statusColors: Record<string, string> = {
  ACTIVE: "bg-success/20 text-success border-success/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  PAST_DUE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  TRIALING: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  const subs = await prisma.subscription.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">My Subscriptions</h1>
      {subs.length === 0 ? (
        <div className="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-white/10">
          <RefreshCw className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No active subscriptions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subs.map((sub) => (
            <div key={sub.id} className="p-5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-white text-sm">{sub.stripePriceId}</p>
                <Badge className={`text-xs border ${statusColors[sub.status] || ""}`}>{sub.status}</Badge>
              </div>
              <div className="text-xs text-white/40 space-y-1">
                <p>Current period: {formatDate(sub.currentPeriodStart)} — {formatDate(sub.currentPeriodEnd)}</p>
                {sub.cancelAtPeriodEnd && <p className="text-yellow-400">Cancels at end of period</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
