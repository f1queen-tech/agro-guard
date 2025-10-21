import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const colorThemes = [
  { 
    id: "green", 
    name: "Farm Green", 
    colors: { 
      light: {
        primary: "142 71% 45%",
        accent: "142 18% 93%",
        sidebarPrimary: "142 71% 45%",
        sidebarAccent: "142 20% 92%",
      },
      dark: {
        primary: "142 70% 45%",
        accent: "142 25% 20%",
        sidebarPrimary: "142 70% 45%",
        sidebarAccent: "142 25% 20%",
      }
    } 
  },
  { 
    id: "blue", 
    name: "Ocean Blue", 
    colors: { 
      light: {
        primary: "217 91% 60%",
        accent: "217 18% 93%",
        sidebarPrimary: "217 91% 60%",
        sidebarAccent: "217 20% 92%",
      },
      dark: {
        primary: "217 91% 60%",
        accent: "217 25% 20%",
        sidebarPrimary: "217 91% 60%",
        sidebarAccent: "217 25% 20%",
      }
    } 
  },
  { 
    id: "orange", 
    name: "Sunset Orange", 
    colors: { 
      light: {
        primary: "24 95% 53%",
        accent: "24 18% 93%",
        sidebarPrimary: "24 95% 53%",
        sidebarAccent: "24 20% 92%",
      },
      dark: {
        primary: "24 95% 53%",
        accent: "24 25% 20%",
        sidebarPrimary: "24 95% 53%",
        sidebarAccent: "24 25% 20%",
      }
    } 
  },
  { 
    id: "purple", 
    name: "Lavender Purple", 
    colors: { 
      light: {
        primary: "262 52% 47%",
        accent: "262 18% 93%",
        sidebarPrimary: "262 52% 47%",
        sidebarAccent: "262 20% 92%",
      },
      dark: {
        primary: "262 52% 60%",
        accent: "262 25% 20%",
        sidebarPrimary: "262 52% 60%",
        sidebarAccent: "262 25% 20%",
      }
    } 
  },
  { 
    id: "teal", 
    name: "Ocean Teal", 
    colors: { 
      light: {
        primary: "173 80% 40%",
        accent: "173 18% 93%",
        sidebarPrimary: "173 80% 40%",
        sidebarAccent: "173 20% 92%",
      },
      dark: {
        primary: "173 58% 39%",
        accent: "173 25% 20%",
        sidebarPrimary: "173 58% 39%",
        sidebarAccent: "173 25% 20%",
      }
    } 
  },
];

export function ThemePicker() {
  const [currentColorTheme, setCurrentColorTheme] = useState(() => 
    localStorage.getItem("color-theme") || "green"
  );

  const applyColorTheme = (themeId: string) => {
    const selectedTheme = colorThemes.find(t => t.id === themeId);
    if (!selectedTheme) return;

    const root = document.documentElement;
    const isDark = document.documentElement.classList.contains("dark");
    const colors = isDark ? selectedTheme.colors.dark : selectedTheme.colors.light;

    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.primary);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
    root.style.setProperty("--sidebar-accent", colors.sidebarAccent);
    root.style.setProperty("--sidebar-ring", colors.sidebarPrimary);
    root.style.setProperty("--chart-1", colors.primary);
    
    localStorage.setItem("color-theme", themeId);
    setCurrentColorTheme(themeId);
  };

  useEffect(() => {
    // Apply saved color theme on mount
    const savedTheme = localStorage.getItem("color-theme") || "green";
    applyColorTheme(savedTheme);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-theme-picker">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Choose theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        {colorThemes.map((colorTheme) => (
          <DropdownMenuItem
            key={colorTheme.id}
            onClick={() => applyColorTheme(colorTheme.id)}
            data-testid={`color-theme-${colorTheme.id}`}
            className={currentColorTheme === colorTheme.id ? "bg-accent" : ""}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: `hsl(${colorTheme.colors.light.primary})`
                }}
              />
              {colorTheme.name}
              {currentColorTheme === colorTheme.id && <span className="ml-auto text-xs">✓</span>}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
