import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  rating: number;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, readonly = false, size = "md", onRate }: Props) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRate?.(star)}
          className={cn("transition-transform", !readonly && "hover:scale-110 cursor-pointer")}
        >
          <Star
            className={cn(
              sizes[size],
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/20 fill-transparent"
            )}
          />
        </button>
      ))}
    </div>
  );
}
