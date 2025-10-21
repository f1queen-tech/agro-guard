import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Droplets,
  Bug,
  CloudRain
} from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

const alertIcons: Record<string, any> = {
  drought: Droplets,
  flood: CloudRain,
  pest: Bug,
};

const alertColors: Record<string, string> = {
  drought: "text-chart-4",
  flood: "text-chart-5",
  pest: "text-chart-3",
};

const getSeverityBadge = (severity: string) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", className: string }> = {
    severe: { variant: "destructive", className: "bg-chart-5 hover:bg-chart-5" },
    high: { variant: "destructive", className: "bg-chart-4 hover:bg-chart-4" },
    medium: { variant: "secondary", className: "bg-chart-3 text-foreground hover:bg-chart-3" },
    low: { variant: "outline", className: "bg-chart-1/10 text-chart-1 border-chart-1/20" },
  };
  
  const config = variants[severity] || variants.medium;
  return (
    <Badge variant={config.variant} className={config.className}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

export default function Alerts() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    queryFn: alertsApi.getAll,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const alertsToday = alerts.filter(alert => 
    new Date(alert.sentAt) >= today
  ).length;

  const filteredAlerts = alerts.filter(alert =>
    alert.alertType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">{t('alertHistory')}</h1>
          <p className="text-muted-foreground">View all sent climate risk warnings and SMS alerts</p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold" data-testid="text-alerts-title">{t('alertHistory')}</h1>
        <p className="text-muted-foreground">View all sent climate risk warnings and SMS alerts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-wrap">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`${t('search')} alerts...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-alerts"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalAlertsSent')}</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-alerts">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1" data-testid="text-alerts-today">{alertsToday}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-alerts-pending">0</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent {t('alerts')}</h2>
        
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const Icon = alertIcons[alert.alertType];
            const iconColor = alertColors[alert.alertType];
            
            return (
              <Card key={alert.id} className="hover-elevate" data-testid={`card-alert-${alert.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted shrink-0">
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">
                            {t(alert.alertType as any)} {t('alerts')}
                          </h3>
                          {getSeverityBadge(alert.severity)}
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Sent
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm bg-muted p-3 rounded-md break-words">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sent {format(new Date(alert.sentAt), "MMM d, yyyy 'at' h:mm a")} via SMS
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    {searchQuery ? "No alerts found" : "No alerts sent yet"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery ? "Try adjusting your search" : "Send alerts from the Dashboard when risks are detected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
