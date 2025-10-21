import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { farmersApi, cropsApi, fieldsApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Search, Pencil, Trash2, Wheat, Carrot, Bean, Apple, Leaf, Droplets, Sprout, Nut } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import type { Field } from "@shared/schema";
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Get appropriate Lucide icon component for crop category
const getCropIcon = (category: string) => {
  const iconMap: Record<string, typeof Wheat> = {
    'Grains': Wheat,
    'Vegetables': Carrot,
    'Legumes': Bean,
    'Fruits': Apple,
    'Cash Crops': Leaf,
    'Oilseeds': Droplets,
    'Herbs & Spices': Leaf,
    'Nuts': Nut,
    'Root Crops': Carrot,
    'Tubers': Carrot,
    'Cereals': Wheat,
    'Pulses': Bean,
  };
  return iconMap[category] || Sprout;
};

// Drawing control component
function DrawingControl({ 
  onPolygonCreated, 
  isDrawing, 
  setIsDrawing 
}: { 
  onPolygonCreated: (coords: [number, number][]) => void;
  isDrawing: boolean;
  setIsDrawing: (val: boolean) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !isDrawing) return;

    console.log('[DrawingControl] Initializing drawing mode');
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false,
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          metric: true,
          shapeOptions: {
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.3,
          },
          // Leaflet.draw allows unlimited vertices by default
          repeatMode: false,
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    // Create event handler that won't be removed prematurely
    const handleCreated = (e: any) => {
      console.log('[DrawingControl] Polygon created event fired!', e);
      const layer = e.layer;
      if (!layer) {
        console.error('[DrawingControl] No layer in event');
        return;
      }
      
      const latlngs = layer.getLatLngs();
      console.log('[DrawingControl] Raw latlngs:', latlngs);
      
      // Handle both polygon structures (nested array for complex polygons)
      const coordArray = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      const coords: [number, number][] = coordArray.map((latlng: L.LatLng) => [latlng.lat, latlng.lng]);
      
      console.log('[DrawingControl] Processed coords:', coords, 'Count:', coords.length);
      
      if (coords.length < 3) {
        console.warn('[DrawingControl] Polygon has less than 3 points, ignoring');
        return;
      }
      
      onPolygonCreated(coords);
      // Clear the drawing layer
      drawnItems.clearLayers();
      setIsDrawing(false);
    };

    // Register event listeners
    console.log('[DrawingControl] Registering draw:created event listener');
    map.on(L.Draw.Event.CREATED, handleCreated);

    return () => {
      console.log('[DrawingControl] Cleaning up');
      map.off(L.Draw.Event.CREATED, handleCreated);
      try {
        map.removeControl(drawControl);
      } catch (e) {
        console.warn('[DrawingControl] Error removing control:', e);
      }
      map.removeLayer(drawnItems);
    };
  }, [map, isDrawing, onPolygonCreated, setIsDrawing]);

  return null;
}

// Center map on farmer when selected
function CenterOnFarmer({ position }: { position?: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  
  return null;
}

export default function FieldMapping() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentPolygonCoords, setCurrentPolygonCoords] = useState<[number, number][] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");
  const [selectedCropId, setSelectedCropId] = useState<string>("");
  const [fieldName, setFieldName] = useState("");
  const [cropSearch, setCropSearch] = useState("");

  const { data: farmers = [], isLoading: loadingFarmers } = useQuery({
    queryKey: ["/api/farmers"],
    queryFn: farmersApi.getAll,
  });

  const { data: crops = [], isLoading: loadingCrops } = useQuery({
    queryKey: ["/api/crops"],
    queryFn: cropsApi.getAll,
  });

  const { data: fields = [] } = useQuery({
    queryKey: ["/api/fields", selectedFarmerId],
    queryFn: () => selectedFarmerId ? fieldsApi.getByFarmer(selectedFarmerId) : Promise.resolve([]),
    enabled: !!selectedFarmerId,
  });

  const createFieldMutation = useMutation({
    mutationFn: fieldsApi.create,
    onSuccess: () => {
      // Invalidate and refetch all fields queries
      queryClient.invalidateQueries({ queryKey: ["/api/fields"] });
      // Force refetch for current farmer
      if (selectedFarmerId) {
        queryClient.refetchQueries({ queryKey: ["/api/fields", selectedFarmerId] });
      }
      toast({
        title: t('fieldCreatedTitle'),
        description: t('fieldCreatedDesc'),
      });
      setFieldName("");
      setSelectedCropId("");
      setCropSearch("");
      setIsDrawing(false);
      setCurrentPolygonCoords(null);
    },
    onError: () => {
      toast({
        title: t('errorTitle'),
        description: t('fieldErrorDesc'),
        variant: "destructive",
      });
    },
  });

  const filteredCrops = cropSearch
    ? crops.filter(crop =>
        crop.name.toLowerCase().includes(cropSearch.toLowerCase()) ||
        crop.category.toLowerCase().includes(cropSearch.toLowerCase())
      ).slice(0, 50)
    : [];

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);
  const defaultCenter: [number, number] = farmers.length > 0
    ? [farmers[0].latitude, farmers[0].longitude]
    : [20, 0];

  const farmerPosition: [number, number] | undefined = selectedFarmer
    ? [selectedFarmer.latitude, selectedFarmer.longitude]
    : undefined;

  const handleSaveField = () => {
    if (!selectedFarmerId || !fieldName || !currentPolygonCoords) {
      toast({
        title: t('errorTitle'),
        description: t('validationErrorDesc'),
        variant: "destructive",
      });
      return;
    }

    // Calculate area using geodesic formula (converts lat/lng to meters first)
    const calculateGeodesicArea = (coords: [number, number][]) => {
      if (coords.length < 3) return 0;

      // Find the centroid
      const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const centerLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

      // Convert lat/lng to meters relative to centroid
      // Using equirectangular approximation (good for small areas)
      const toMeters = (lat: number, lng: number): [number, number] => {
        const R = 6371000; // Earth's radius in meters
        const latRad = (centerLat * Math.PI) / 180;
        const x = (lng - centerLng) * Math.cos(latRad) * (Math.PI / 180) * R;
        const y = (lat - centerLat) * (Math.PI / 180) * R;
        return [x, y];
      };

      // Convert all coordinates to meters
      const meterCoords = coords.map(c => toMeters(c[0], c[1]));

      // Apply shoelace formula on meter coordinates
      let areaMeters = 0;
      for (let i = 0; i < meterCoords.length; i++) {
        const j = (i + 1) % meterCoords.length;
        areaMeters += meterCoords[i][0] * meterCoords[j][1];
        areaMeters -= meterCoords[j][0] * meterCoords[i][1];
      }
      areaMeters = Math.abs(areaMeters) / 2;

      // Convert square meters to hectares (1 hectare = 10,000 m²)
      return areaMeters / 10000;
    };

    const area = calculateGeodesicArea(currentPolygonCoords);
    const coordsArray = currentPolygonCoords.map(coord => ({ lat: coord[0], lng: coord[1] }));
    const center = getFieldCenter(coordsArray);

    createFieldMutation.mutate({
      farmerId: selectedFarmerId,
      name: fieldName,
      coordinates: JSON.stringify(coordsArray),
      centerLatitude: center[0],
      centerLongitude: center[1],
      area,
      cropId: selectedCropId || null,
    });
  };

  const handlePolygonCreated = (coords: [number, number][]) => {
    console.log('[FieldMapping] Polygon created with coords:', coords);
    setCurrentPolygonCoords(coords);
  };

  const getCropCategory = (cropId: string | null): string => {
    if (!cropId) return '';
    const crop = crops.find(c => c.id === cropId);
    return crop?.category || '';
  };

  const parseCoordinates = (coords: string): { lat: number; lng: number }[] => {
    try {
      return JSON.parse(coords);
    } catch {
      return [];
    }
  };

  const getFieldCenter = (coords: { lat: number; lng: number }[]): [number, number] => {
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);
    return [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ];
  };

  const createCropIcon = (category: string) => {
    // Simple text-based category indicator
    const categoryShortNames: Record<string, string> = {
      'Grains': 'GR',
      'Vegetables': 'VE',
      'Legumes': 'LE',
      'Fruits': 'FR',
      'Cash Crops': 'CA',
      'Oilseeds': 'OI',
      'Herbs & Spices': 'HE',
      'Nuts': 'NU',
      'Root Crops': 'RO',
      'Tubers': 'TU',
      'Cereals': 'CE',
      'Pulses': 'PU',
    };
    
    const categoryColors: Record<string, string> = {
      'Grains': '#f59e0b',
      'Vegetables': '#10b981',
      'Legumes': '#8b5cf6',
      'Fruits': '#ef4444',
      'Cash Crops': '#45a04a',
      'Oilseeds': '#f97316',
      'Herbs & Spices': '#06b6d4',
      'Nuts': '#84cc16',
      'Root Crops': '#d97706',
      'Tubers': '#a855f7',
      'Cereals': '#eab308',
      'Pulses': '#6366f1',
    };
    
    const shortName = categoryShortNames[category] || 'CR';
    const color = categoryColors[category] || '#45a04a';
    
    const container = document.createElement('div');
    container.style.cssText = `
      width: 40px;
      height: 40px;
      background: white;
      border: 3px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      font-weight: bold;
      font-size: 12px;
      color: ${color};
      font-family: system-ui, -apple-system, sans-serif;
    `;
    container.textContent = shortName;
    
    return L.divIcon({
      html: container.outerHTML,
      className: 'crop-icon-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  if (loadingFarmers || loadingCrops) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">{t('fieldMappingTitle')}</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold" data-testid="heading-field-mapping">{t('fieldMappingTitle')}</h1>
        <p className="text-muted-foreground">
          {t('mapAndTrack')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="h-[600px] w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={defaultCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  data-testid="map-container"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {farmerPosition && <CenterOnFarmer position={farmerPosition} />}
                  
                  {farmerPosition && (
                    <Marker position={farmerPosition}>
                      <Popup>{selectedFarmer?.name}</Popup>
                    </Marker>
                  )}

                  {fields.map((field) => {
                    const coords = parseCoordinates(field.coordinates);
                    const cropCategory = getCropCategory(field.cropId);
                    return (
                      <>
                        <Polygon
                          key={`polygon-${field.id}`}
                          positions={coords.map(c => [c.lat, c.lng])}
                          pathOptions={{
                            color: '#45a04a',
                            fillColor: '#45a04a',
                            fillOpacity: 0.2,
                            weight: 2,
                          }}
                        >
                          <Popup>
                            <div>
                              <p className="font-semibold">{field.name}</p>
                              <p className="text-sm">Area: {field.area.toFixed(2)} ha</p>
                              {field.cropId && (
                                <p className="text-sm">
                                  Crop: {crops.find(c => c.id === field.cropId)?.name}
                                </p>
                              )}
                            </div>
                          </Popup>
                        </Polygon>
                        
                        {field.cropId && coords.length > 0 && (
                          <Marker
                            key={`marker-${field.id}`}
                            position={getFieldCenter(coords)}
                            icon={createCropIcon(cropCategory)}
                          >
                            <Popup>
                              <div>
                                <p className="font-semibold">{field.name}</p>
                                <p className="text-sm">{crops.find(c => c.id === field.cropId)?.name}</p>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </>
                    );
                  })}

                  {currentPolygonCoords && (
                    <Polygon
                      positions={currentPolygonCoords}
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    />
                  )}

                  <DrawingControl
                    onPolygonCreated={handlePolygonCreated}
                    isDrawing={isDrawing}
                    setIsDrawing={setIsDrawing}
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('drawField')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('selectFarmer')}</Label>
                <Select value={selectedFarmerId} onValueChange={setSelectedFarmerId}>
                  <SelectTrigger data-testid="select-farmer">
                    <SelectValue placeholder={t('selectFarmerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map((farmer) => (
                      <SelectItem key={farmer.id} value={farmer.id}>
                        {farmer.name} - {farmer.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('fieldName')}</Label>
                <Input
                  placeholder={t('fieldNamePlaceholder')}
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  data-testid="input-field-name"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('searchSelectCrop')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchCrops')}
                    value={cropSearch}
                    onChange={(e) => setCropSearch(e.target.value)}
                    className="pl-10"
                    data-testid="input-crop-search"
                  />
                </div>
                {cropSearch && filteredCrops.length > 0 && (
                  <div className="border rounded-md max-h-48 overflow-y-auto">
                    {filteredCrops.map((crop) => (
                      <div
                        key={crop.id}
                        onClick={() => {
                          setSelectedCropId(crop.id);
                          setCropSearch(crop.name);
                        }}
                        className={`p-2 hover-elevate cursor-pointer ${
                          selectedCropId === crop.id ? 'bg-accent' : ''
                        }`}
                        data-testid={`crop-option-${crop.id}`}
                      >
                        <div className="font-medium">{crop.name}</div>
                        <div className="text-xs text-muted-foreground">{crop.category}</div>
                      </div>
                    ))}
                    {filteredCrops.length === 50 && (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        {t('showingResults', { count: 50, total: crops.filter(c => 
                          c.name.toLowerCase().includes(cropSearch.toLowerCase()) ||
                          c.category.toLowerCase().includes(cropSearch.toLowerCase())
                        ).length })}
                      </div>
                    )}
                  </div>
                )}
                {cropSearch && filteredCrops.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t('noCropsFound')}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsDrawing(true)}
                  disabled={!selectedFarmerId || isDrawing}
                  className="w-full"
                  data-testid="button-start-drawing"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {t('drawField')}
                </Button>

                <Button
                  onClick={handleSaveField}
                  disabled={!currentPolygonCoords || !fieldName || createFieldMutation.isPending}
                  className="w-full"
                  data-testid="button-save-field"
                >
                  {createFieldMutation.isPending ? t('saving') : t('saveField')}
                </Button>

                {currentPolygonCoords && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPolygonCoords(null);
                      setIsDrawing(false);
                    }}
                    className="w-full"
                    data-testid="button-clear-drawing"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('clearDrawing')}
                  </Button>
                )}
              </div>

              {isDrawing && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md text-sm">
                  <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">
                    {t('drawingInstructionsTitle')}
                  </p>
                  <ul className="text-blue-900 dark:text-blue-100 space-y-1 list-disc list-inside">
                    <li>{t('instruction1')}</li>
                    <li>{t('instruction2')}</li>
                    <li>{t('instruction3')}</li>
                    <li>{t('instruction4')}</li>
                    <li>{t('instruction5')}</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedFarmerId && fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('myFields')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="p-3 border rounded-md hover-elevate"
                      data-testid={`field-item-${field.id}`}
                    >
                      <div className="font-medium">{field.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('area')}: {field.area.toFixed(2)} ha
                      </div>
                      {field.cropId && (
                        <div className="text-sm text-muted-foreground">
                          {t('crop')}: {crops.find(c => c.id === field.cropId)?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
