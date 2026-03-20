"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("omni-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("omni-cookie-consent", JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: Date.now() }));
    setVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("omni-cookie-consent", JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-slide-up">
      <div className="bg-[#1E293B] border border-white/20 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <Cookie className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white text-sm mb-1">Cookie Preferences</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              We use cookies to improve your experience. Necessary cookies are always active.{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={acceptNecessary} className="flex-1 border-white/20 text-white/70 hover:bg-white/10 text-xs">
            Necessary Only
          </Button>
          <Button size="sm" onClick={accept} className="flex-1 bg-gradient-primary text-white hover:opacity-90 text-xs">
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
