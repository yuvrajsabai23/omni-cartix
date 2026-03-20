import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Download, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Downloads" };

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions);
  const links = await prisma.downloadLink.findMany({
    where: { userId: session!.user.id },
    include: { product: { select: { name: true, thumbnailUrl: true, type: true } } },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const active = links.filter((l) => l.expiresAt > now && l.downloadCount < l.maxDownloads);
  const expired = links.filter((l) => l.expiresAt <= now || l.downloadCount >= l.maxDownloads);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">My Downloads</h1>

      {links.length === 0 ? (
        <div className="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-white/10">
          <Download className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No downloads yet. Purchase a digital product to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Active Downloads</h2>
              <div className="space-y-3">
                {active.map((link) => (
                  <div key={link.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{link.product.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Clock className="h-3 w-3" />
                          Expires {formatDistanceToNow(link.expiresAt, { addSuffix: true })}
                        </span>
                        <span className="text-xs text-white/40">
                          {link.downloadCount}/{link.maxDownloads} downloads used
                        </span>
                      </div>
                    </div>
                    <Link href={`/api/downloads/${link.token}`} target="_blank">
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expired.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Expired</h2>
              <div className="space-y-2 opacity-50">
                {expired.map((link) => (
                  <div key={link.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl">
                    <AlertTriangle className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-white/50">{link.product.name}</p>
                      <p className="text-xs text-white/30">
                        {link.downloadCount >= link.maxDownloads ? "Download limit reached" : "Expired"}
                      </p>
                    </div>
                    <Badge className="bg-white/5 text-white/30 border-white/10 text-xs">Expired</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
