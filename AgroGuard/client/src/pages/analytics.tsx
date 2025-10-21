import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Droplets,
  Bug,
  CloudRain
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

const alertsByType = [
  { name: "Drought", value: 45, color: "hsl(var(--chart-4))" },
  { name: "Flood", value: 25, color: "hsl(var(--chart-5))" },
  { name: "Pest Risk", value: 30, color: "hsl(var(--chart-3))" },
];

const monthlyAlerts = [
  { month: "Jan", drought: 12, flood: 5, pest: 8 },
  { month: "Feb", drought: 15, flood: 3, pest: 10 },
  { month: "Mar", drought: 10, flood: 8, pest: 7 },
  { month: "Apr", drought: 8, flood: 12, pest: 9 },
  { month: "May", drought: 18, flood: 6, pest: 12 },
  { month: "Jun", drought: 20, flood: 4, pest: 15 },
];

const riskTrends = [
  { week: "Week 1", risk: 35 },
  { week: "Week 2", risk: 42 },
  { week: "Week 3", risk: 38 },
  { week: "Week 4", risk: 55 },
  { week: "Week 5", risk: 48 },
  { week: "Week 6", risk: 62 },
];

export default function Analytics() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold" data-testid="text-analytics-title">{t('analytics')}</h1>
        <p className="text-muted-foreground">Climate risk trends and alert performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('responseRate')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-response-rate">94.5%</div>
            <p className="text-xs text-chart-1 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgResponseTime')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-response">2.3 hrs</div>
            <p className="text-xs text-chart-1 flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              -0.5 hrs improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeFarmers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-farmers">1</div>
            <p className="text-xs text-muted-foreground">Receiving alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('riskScore')}</CardTitle>
            <Activity className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4" data-testid="text-risk-score">62/100</div>
            <p className="text-xs text-muted-foreground">High risk level</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('alertsByType')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('riskTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('monthlyDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyAlerts}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar dataKey="drought" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} name="Drought" />
              <Bar dataKey="flood" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Flood" />
              <Bar dataKey="pest" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Pest Risk" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('drought')} {t('alerts')}</CardTitle>
            <Droplets className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-chart-4 hover:bg-chart-4">High Risk</Badge>
              <span className="text-xs text-muted-foreground">Last 6 months</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('flood')} {t('alerts')}</CardTitle>
            <CloudRain className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-chart-3 text-foreground hover:bg-chart-3">Medium Risk</Badge>
              <span className="text-xs text-muted-foreground">Last 6 months</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pest')} {t('alerts')}</CardTitle>
            <Bug className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-chart-3 text-foreground hover:bg-chart-3">Medium Risk</Badge>
              <span className="text-xs text-muted-foreground">Last 6 months</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
