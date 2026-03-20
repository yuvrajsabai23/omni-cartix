import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Key } from "lucide-react";
import CopyButton from "@/components/shared/CopyButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Licenses" };

export default async function LicensesPage() {
  const session = await getServerSession(authOptions);
  const licenses = await prisma.licenseKey.findMany({
    where: { userId: session!.user.id },
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">License Keys</h1>
      {licenses.length === 0 ? (
        <div className="text-center py-20 text-white/40 bg-white/5 rounded-xl border border-white/10">
          <Key className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>No license keys yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {licenses.map((license) => (
            <div key={license.id} className="p-5 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-sm font-medium text-white mb-2">{license.product.name}</p>
              <div className="flex items-center gap-3 bg-dark/50 rounded-lg px-4 py-3">
                <code className="flex-1 text-sm font-mono text-accent tracking-wider">{license.key}</code>
                <CopyButton text={license.key} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                <span>Activations: {license.activations}/{license.maxActivations}</span>
                {license.expiresAt && <span>Expires: {new Date(license.expiresAt).toLocaleDateString("en-GB")}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
