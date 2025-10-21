import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fieldsApi, farmersApi, cropsApi } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MapPin, Sprout, Edit, Trash2, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import type { Field, Farmer, Crop } from "@shared/schema";

export default function FieldsManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: farmers = [], isLoading: loadingFarmers } = useQuery({
    queryKey: ["/api/farmers"],
    queryFn: farmersApi.getAll,
  });

  const { data: crops = [], isLoading: loadingCrops } = useQuery({
    queryKey: ["/api/crops"],
    queryFn: cropsApi.getAll,
  });

  const { data: allFields = [], isLoading: loadingFields } = useQuery({
    queryKey: ["/api/fields/all"],
    queryFn: async () => {
      const farmerFields = await Promise.all(
        farmers.map(farmer => fieldsApi.getByFarmer(farmer.id))
      );
      return farmerFields.flat();
    },
    enabled: farmers.length > 0,
  });

  const isLoading = loadingFarmers || loadingCrops || loadingFields;

  const getFarmerById = (id: string) => farmers.find(f => f.id === id);
  const getCropById = (id: string | null) => id ? crops.find(c => c.id === id) : null;

  const filteredFields = allFields.filter(field => {
    const farmer = getFarmerById(field.farmerId);
    const crop = getCropById(field.cropId);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      field.name.toLowerCase().includes(searchLower) ||
      farmer?.name.toLowerCase().includes(searchLower) ||
      crop?.name.toLowerCase().includes(searchLower)
    );
  });

  const totalFields = allFields.length;
  const totalArea = allFields.reduce((sum, field) => sum + field.area, 0);
  const fieldsWithCrops = allFields.filter(f => f.cropId).length;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">{t('myFields')}</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold" data-testid="heading-fields-management">
            {t('myFields')}
          </h1>
          {totalFields >= 5 && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1" data-testid="badge-beta">
              <Sparkles className="h-3 w-3" />
              BETA ACCESS
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Manage all your mapped fields across all farmers
          {totalFields >= 5 && " • You have access to advanced multicropping techniques!"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalFields')}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-fields">{totalFields}</div>
            <p className="text-xs text-muted-foreground">
              Across {farmers.length} {t('farmers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalArea')}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-area">
              {totalArea.toFixed(2)} ha
            </div>
            <p className="text-xs text-muted-foreground">
              Hectares mapped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('fieldsWithCrops')}</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-fields-with-crops">{fieldsWithCrops}</div>
            <p className="text-xs text-muted-foreground">
              {totalFields > 0 ? `${((fieldsWithCrops / totalFields) * 100).toFixed(0)}% of total` : t('noFieldsYet')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`${t('search')} fields, farmers, or crops...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-fields"
          />
        </div>
      </div>

      {filteredFields.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t('noFieldsYet')}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchTerm ? "No fields match your search" : `${t('startBy')} mapping fields for your farmers`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFields.map((field) => {
            const farmer = getFarmerById(field.farmerId);
            const crop = getCropById(field.cropId);
            
            return (
              <Card key={field.id} className="hover-elevate" data-testid={`field-card-${field.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{field.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {farmer?.name || "Unknown Farmer"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" data-testid={`button-edit-field-${field.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-delete-field-${field.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>{field.area.toFixed(2)} ha</strong>
                      </span>
                    </div>
                    
                    {crop ? (
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {crop.name}
                          <span className="text-muted-foreground ml-1">({crop.category})</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t('noCrop')}</span>
                      </div>
                    )}

                    {crop && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => window.location.href = `/crop/${crop.id}`}
                        data-testid={`button-view-crop-${crop.id}`}
                      >
                        {t('viewDetails')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
