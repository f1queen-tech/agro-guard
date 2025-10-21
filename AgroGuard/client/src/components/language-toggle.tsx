import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-translation";
import type { Language } from "@/lib/translations";

const languages: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
];

export function LanguageToggle() {
  const { language, changeLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-language-toggle">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            data-testid={`language-option-${lang.code}`}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">{lang.nativeName}</span>
              {language === lang.code && <span className="text-xs">✓</span>}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
