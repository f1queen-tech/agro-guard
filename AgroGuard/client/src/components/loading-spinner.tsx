import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-muted rounded w-3/4"></div>
    </div>
  );
}
