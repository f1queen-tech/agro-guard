import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemePicker } from "@/components/theme-picker";
import { LanguageToggle } from "@/components/language-toggle";
import { AccessibilitySettings } from "@/components/accessibility-settings";
import { Chatbot } from "@/components/chatbot";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Dashboard from "@/pages/dashboard";
import Farmers from "@/pages/farmers";
import Alerts from "@/pages/alerts";
import Analytics from "@/pages/analytics";
import FieldMapping from "@/pages/field-mapping";
import FieldsManagement from "@/pages/fields-management";
import CropDetails from "@/pages/crop-details";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/farmers" component={Farmers} />
      <Route path="/fields" component={FieldMapping} />
      <Route path="/fields-management" component={FieldsManagement} />
      <Route path="/crop/:id" component={CropDetails} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <a href="#main-content" className="skip-to-main">
          {t('skipToMainContent')}
        </a>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b bg-background shrink-0" role="banner">
                <SidebarTrigger data-testid="button-sidebar-toggle" aria-label={t('toggleSidebarNav')} />
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsChatbotOpen(true)}
                    data-testid="button-open-chat"
                    aria-label={t('openAIAssistant')}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <AccessibilitySettings />
                  <LanguageToggle />
                  <ThemePicker />
                  <ThemeToggle />
                </div>
              </header>
              <main id="main-content" className="flex-1 overflow-auto" role="main" aria-label={t('mainContent')}>
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Chatbot isOpen={isChatbotOpen} onToggle={setIsChatbotOpen} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
