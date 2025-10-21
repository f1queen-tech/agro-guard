import { Home, Users, Bell, BarChart3, Map } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Sprout } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useState, useEffect } from "react";
import type { TranslationKey } from "@/lib/translations";

const menuItems: Array<{ titleKey: TranslationKey; url: string; icon: any; testId: string }> = [
  {
    titleKey: "dashboard",
    url: "/",
    icon: Home,
    testId: "link-dashboard",
  },
  {
    titleKey: "farmers",
    url: "/farmers",
    icon: Users,
    testId: "link-farmers",
  },
  {
    titleKey: "fieldMapping",
    url: "/fields",
    icon: Map,
    testId: "link-field-mapping",
  },
  {
    titleKey: "myFields",
    url: "/fields-management",
    icon: Map,
    testId: "link-fields-management",
  },
  {
    titleKey: "alerts",
    url: "/alerts",
    icon: Bell,
    testId: "link-alerts",
  },
  {
    titleKey: "analytics",
    url: "/analytics",
    icon: BarChart3,
    testId: "link-analytics",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t, language } = useTranslation();
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  return (
    <Sidebar role="navigation" aria-label={t('mainNavigation')}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground" aria-hidden="true">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">FarmGuard</span>
            <span className="text-xs text-muted-foreground">{t('climateIntelligence')}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('mainMenu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link 
                      href={item.url} 
                      data-testid={item.testId}
                      aria-label={`Navigate to ${t(item.titleKey)}`}
                      aria-current={location === item.url ? "page" : undefined}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground" role="contentinfo">
          <p>{t('protectingFarmers')}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
