import { useEffect, useState } from "react";
import {
  Eye,
  Type,
  Volume2,
  Accessibility,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";

type TextSize = "normal" | "large" | "extra-large";
type ContrastMode = "normal" | "high";

export function AccessibilitySettings() {
  const { t } = useTranslation();
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [highContrast, setHighContrast] = useState<ContrastMode>("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedTextSize = localStorage.getItem("accessibility-text-size") as TextSize;
    const savedHighContrast = localStorage.getItem("accessibility-high-contrast") as ContrastMode;
    const savedReducedMotion = localStorage.getItem("accessibility-reduced-motion") === "true";
    const savedScreenReader = localStorage.getItem("accessibility-screen-reader") === "true";

    if (savedTextSize) setTextSize(savedTextSize);
    if (savedHighContrast) setHighContrast(savedHighContrast);
    if (savedReducedMotion) setReducedMotion(savedReducedMotion);
    if (savedScreenReader) setScreenReaderMode(savedScreenReader);
  }, []);

  // Apply text size
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-normal", "text-large", "text-extra-large");
    root.classList.add(`text-${textSize}`);
    localStorage.setItem("accessibility-text-size", textSize);
  }, [textSize]);

  // Apply high contrast
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("accessibility-high-contrast", highContrast);
  }, [highContrast]);

  // Apply reduced motion
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
    localStorage.setItem("accessibility-reduced-motion", reducedMotion.toString());
  }, [reducedMotion]);

  // Apply screen reader mode
  useEffect(() => {
    const root = document.documentElement;
    if (screenReaderMode) {
      root.classList.add("screen-reader-optimized");
    } else {
      root.classList.remove("screen-reader-optimized");
    }
    localStorage.setItem("accessibility-screen-reader", screenReaderMode.toString());
  }, [screenReaderMode]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('accessibilitySettings')}
          data-testid="button-accessibility"
        >
          <Accessibility className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{t('accessibilitySettings')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" aria-hidden="true" />
            <span>{t('accessibilityLabel')}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          <div className="flex items-center gap-2">
            <Type className="h-3 w-3" aria-hidden="true" />
            <span>{t('textSize')}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTextSize("normal")}
          data-testid="option-text-size-normal"
        >
          <div className="flex items-center justify-between w-full">
            <span>{t('normal')}</span>
            {textSize === "normal" && <Check className="h-4 w-4" aria-hidden="true" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTextSize("large")}
          data-testid="option-text-size-large"
        >
          <div className="flex items-center justify-between w-full">
            <span>{t('large')}</span>
            {textSize === "large" && <Check className="h-4 w-4" aria-hidden="true" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTextSize("extra-large")}
          data-testid="option-text-size-extra-large"
        >
          <div className="flex items-center justify-between w-full">
            <span>{t('extraLarge')}</span>
            {textSize === "extra-large" && <Check className="h-4 w-4" aria-hidden="true" />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span>{t('visual')}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={highContrast === "high"}
          onCheckedChange={(checked) =>
            setHighContrast(checked ? "high" : "normal")
          }
          data-testid="option-high-contrast"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" aria-hidden="true" />
            <span>{t('highContrast')}</span>
          </div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
          data-testid="option-reduced-motion"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" aria-hidden="true" />
            <span>{t('reduceMotion')}</span>
          </div>
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={screenReaderMode}
          onCheckedChange={setScreenReaderMode}
          data-testid="option-screen-reader"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>{t('screenReaderOptimizations')}</span>
          </div>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
