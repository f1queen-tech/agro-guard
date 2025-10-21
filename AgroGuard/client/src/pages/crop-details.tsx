import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cropsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useTranslation } from "@/hooks/use-translation";
import { 
  Sprout, 
  Droplet, 
  Sun, 
  Thermometer, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CropDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const [, setLocation] = useLocation();
  const cropId = params.id;

  const { data: crop, isLoading } = useQuery({
    queryKey: ["/api/crops", cropId],
    queryFn: () => cropsApi.getAll().then(crops => crops.find(c => c.id === cropId)),
    enabled: !!cropId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <LoadingSpinner />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Crop Not Found</h1>
        <p>The requested crop could not be found.</p>
        <Button onClick={() => setLocation("/fields")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fields
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setLocation("/fields-management")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold" data-testid="crop-name">{crop.name}</h1>
            <Badge variant="secondary" data-testid="crop-category">{crop.category}</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {crop.scientificName || t('completeGuide')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Growing Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Temperature</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Optimal: 18-30°C (64-86°F)<br />
                Minimum: 10°C (50°F) | Maximum: 35°C (95°F)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Sunlight</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Full sun (6-8 hours daily) for best yield
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Water Requirements</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Moderate to high water needs<br />
                Regular irrigation during dry spells
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Growing Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Planting Season</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Spring to early summer (March-June in Northern Hemisphere)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Growing Period</span>
              </div>
              <p className="text-sm text-muted-foreground">
                90-120 days from planting to harvest
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Harvest Time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Late summer to fall (August-October)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">1. Soil Preparation</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Well-drained, fertile soil with pH 6.0-7.5</li>
              <li>Add compost or organic matter to improve soil structure</li>
              <li>Ensure good drainage to prevent waterlogging</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Planting</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Plant seeds or seedlings after last frost</li>
              <li>Space plants 30-45cm (12-18 inches) apart</li>
              <li>Plant at depth of 2-3cm (1 inch)</li>
              <li>Water thoroughly after planting</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Maintenance</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Water regularly, keeping soil consistently moist</li>
              <li>Apply mulch to retain moisture and suppress weeds</li>
              <li>Fertilize every 2-3 weeks during growing season</li>
              <li>Monitor for pests and diseases regularly</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Harvesting</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Harvest when fully mature (color, size, firmness)</li>
              <li>Use clean, sharp tools to avoid damage</li>
              <li>Harvest in morning for best quality</li>
              <li>Handle carefully to prevent bruising</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <span>Rotate crops annually to prevent soil depletion</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <span>Use organic mulch to improve soil health</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <span>Practice companion planting for natural pest control</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <span>Monitor soil moisture regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <span>Keep detailed records of planting and harvest dates</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Common Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <span><strong>Overwatering:</strong> Can lead to root rot and fungal diseases</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <span><strong>Pest Infestation:</strong> Monitor for aphids, caterpillars, and beetles</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <span><strong>Nutrient Deficiency:</strong> Yellow leaves may indicate nitrogen shortage</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <span><strong>Poor Pollination:</strong> Ensure adequate bee activity</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <span><strong>Disease:</strong> Watch for powdery mildew and blight</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Start seeds indoors 4-6 weeks before last frost for earlier harvest</p>
          <p>• Use drip irrigation or soaker hoses for efficient water usage</p>
          <p>• Apply balanced organic fertilizer at planting and mid-season</p>
          <p>• Prune regularly to improve air circulation and prevent disease</p>
          <p>• Save seeds from best performers for next season</p>
        </CardContent>
      </Card>
    </div>
  );
}
