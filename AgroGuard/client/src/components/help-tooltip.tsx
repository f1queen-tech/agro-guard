import { HelpCircle, LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function HelpTooltip({
  icon: Icon,
  title,
  description,
  side = "top",
}: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center p-1 rounded-full hover-elevate"
          aria-label={`Help: ${title}`}
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <div className="flex flex-col gap-2">
          {Icon && (
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="font-semibold">{title}</p>
            </div>
          )}
          {!Icon && <p className="font-semibold">{title}</p>}
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
