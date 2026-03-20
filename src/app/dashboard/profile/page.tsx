"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await update({ name });
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">My Profile</h1>
      <div className="max-w-lg bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label className="text-white/70 text-sm">Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-white/10 border-white/20 text-white" />
          </div>
          <div>
            <Label className="text-white/70 text-sm">Email</Label>
            <Input value={session?.user?.email || ""} disabled className="mt-1 bg-white/5 border-white/10 text-white/50" />
            <p className="text-xs text-white/30 mt-1">Email cannot be changed.</p>
          </div>
          <Button type="submit" disabled={loading} className="bg-gradient-primary text-white hover:opacity-90">
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
