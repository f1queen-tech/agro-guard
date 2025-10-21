import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CloudRain, 
  Droplets, 
  Thermometer, 
  AlertTriangle,
  TrendingUp,
  Users,
  Bell,
  Send,
  Bug,
  Cloud,
  Sun,
  CloudDrizzle,
  Sparkles
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi, weatherApi } from "@/lib/api";
import { LoadingSpinner, LoadingCard } from "@/components/loading-spinner";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/use-translation";

const weatherIcons: Record<string, any> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
};

const riskIcons: Record<string, any> = {
  drought: Droplets,
  flood: CloudRain,
  pest: Bug,
};

const riskColors: Record<string, { color: string; bgColor: string; gradient: string }> = {
  drought: { 
    color: "text-amber-600 dark:text-amber-400", 
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  flood: { 
    color: "text-blue-600 dark:text-blue-400", 
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  pest: { 
    color: "text-emerald-600 dark:text-emerald-400", 
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
};

const getSeverityBadge = (severity: string) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", className: string }> = {
    severe: { variant: "destructive", className: "bg-red-500 hover:bg-red-600 text-white border-0" },
    high: { variant: "destructive", className: "bg-orange-500 hover:bg-orange-600 text-white border-0" },
    medium: { variant: "secondary", className: "bg-yellow-500 hover:bg-yellow-600 text-white border-0" },
    low: { variant: "outline", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  };
  
  const config = variants[severity] || variants.medium;
  return (
    <Badge variant={config.variant} className={config.className}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

const riskTitles: Record<string, string> = {
  drought: "Drought Risk",
  flood: "Flood Risk",
  pest: "Pest Risk",
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: dashboardApi.getStats,
  });

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["/api/weather/San Jose"],
    queryFn: () => weatherApi.getByLocation("San Jose"),
    enabled: !!stats && stats.totalFarmers > 0,
  });

  if (statsLoading) {
    return (
      <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('dashboard')}
          </h1>
          <p className="text-lg text-muted-foreground">Monitor weather conditions and climate risks across all farm locations</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  const temperatureData = weather?.forecast.slice(0, 7).map((day, i) => ({
    day: format(new Date(day.date), 'EEE'),
    temp: (day.tempMax + day.tempMin) / 2,
    high: day.tempMax,
    low: day.tempMin,
  })) || [];

  const rainfallData = weather?.forecast.slice(0, 7).map((day, i) => ({
    day: format(new Date(day.date), 'EEE'),
    rainfall: day.rainfall,
  })) || [];

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent" data-testid="text-dashboard-title">
          {t('dashboard')}
        </h1>
        <p className="text-lg text-muted-foreground">Monitor weather conditions and climate risks across all farm locations</p>
      </div>

      {/* Stats Cards with Gradients */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('totalFarmers')}</CardTitle>
            <Users className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white" data-testid="text-total-farmers">{stats?.totalFarmers || 0}</div>
            <p className="text-sm text-white/70 mt-1">Registered in system</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('alertsSentToday')}</CardTitle>
            <Bell className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white" data-testid="text-alerts-today">{stats?.alertsSentToday || 0}</div>
            <p className="text-sm text-white/70 mt-1">Via SMS</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('activeRisks')}</CardTitle>
            <AlertTriangle className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white" data-testid="text-active-warnings">{stats?.activeWarnings || 0}</div>
            <p className="text-sm text-white/70 mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">{t('currentTemp')}</CardTitle>
            <Thermometer className="h-5 w-5 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white" data-testid="text-current-temp">
              {weather ? `${Math.round(weather.temperature)}°C` : '--°C'}
            </div>
            <p className="text-sm text-white/70 mt-1 flex items-center gap-1">
              {weather?.conditions || 'Loading...'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {weather && temperatureData.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                  <Thermometer className="h-5 w-5 text-white" />
                </div>
                {t('temperatureTrend')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={temperatureData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
                  <XAxis dataKey="day" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#f97316"
                    strokeWidth={3}
                    fill="url(#tempGradient)"
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <CloudRain className="h-5 w-5 text-white" />
                </div>
                {t('rainfallTrend')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={rainfallData}>
                  <defs>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
                  <XAxis dataKey="day" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="rainfall" fill="url(#rainGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 7-Day Forecast */}
      {weather && weather.forecast.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {t('forecast')}
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {weather.forecast.slice(0, 7).map((day, index) => {
              const Icon = weatherIcons[day.conditions] || Cloud;
              return (
                <Card key={index} className="hover-elevate border-0 shadow-md transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-semibold mb-3 text-muted-foreground">{format(new Date(day.date), 'EEE')}</p>
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold mb-2">{Math.round((day.tempMax + day.tempMin) / 2)}°</p>
                    <p className="text-xs text-muted-foreground">{day.conditions}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Alerts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            {t('activeRiskAlerts')}
          </h2>
        </div>
        
        {stats && stats.currentRisks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {stats.currentRisks.map((risk, index) => {
              const Icon = riskIcons[risk.type];
              const colors = riskColors[risk.type];
              
              return (
                <Card key={index} className={`hover-elevate border-0 shadow-lg ${colors.bgColor}`} data-testid={`card-risk-${risk.type}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-white/50 dark:bg-black/20 shadow-inner`}>
                          <Icon className={`h-7 w-7 ${colors.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">{riskTitles[risk.type]}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                        </div>
                      </div>
                      {getSeverityBadge(risk.severity)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4" />
                        <span>{risk.affectedFarmers} farmers affected</span>
                      </div>
                      <Button variant="default" size="sm" className="shadow-md" data-testid={`button-alert-${risk.type}`}>
                        <Send className="h-3 w-3 mr-2" />
                        {t('sendAlert')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
            <CardContent className="p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">No active risk alerts</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalFarmers === 0 ? "Add farmers to start monitoring" : "Weather conditions are favorable"}
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
