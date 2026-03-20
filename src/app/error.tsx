"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
      <p className="text-white/50 max-w-md mb-8">
        An unexpected error occurred. Our team has been notified. Please try again.
      </p>
      <Button onClick={reset} className="bg-gradient-primary text-white hover:opacity-90">
        Try Again
      </Button>
    </div>
  );
}
