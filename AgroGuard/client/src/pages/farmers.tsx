import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Edit, 
  Trash2,
  Globe
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFarmerSchema, type Language } from "@shared/schema";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { farmersApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";

const farmerFormSchema = insertFarmerSchema.extend({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

type FarmerFormValues = z.infer<typeof farmerFormSchema>;

const languageLabels: Record<Language, string> = {
  en: "English",
  es: "Español",
  hi: "हिन्दी",
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Farmers() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showLocationHelper, setShowLocationHelper] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { toast } = useToast();

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["/api/farmers"],
    queryFn: farmersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: farmersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Farmer added",
        description: "The farmer has been successfully added to the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add farmer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: farmersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Farmer removed",
        description: "The farmer has been removed from the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete farmer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      latitude: 0,
      longitude: 0,
      language: "en",
    },
  });

  const onSubmit = (data: FarmerFormValues) => {
    createMutation.mutate(data);
  };

  const geocodeLocation = async () => {
    const location = form.getValues("location");
    if (!location) {
      toast({
        title: t('enterAddress'),
        description: "Please enter a city or address to find coordinates.",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      // Use Nominatim (OpenStreetMap) for free geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
        {
          headers: {
            'User-Agent': 'FarmGuard Climate App'
          }
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        form.setValue("latitude", lat);
        form.setValue("longitude", lng);
        toast({
          title: t('geocodeSuccess'),
          description: `Coordinates set to ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
        setShowLocationHelper(false);
      } else {
        toast({
          title: "Location not found",
          description: t('geocodeError'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: t('geocodeError'),
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">{t('farmers')}</h1>
          <p className="text-muted-foreground">Manage farmer profiles and contact information</p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold" data-testid="text-farmers-title">{t('farmers')}</h1>
        <p className="text-muted-foreground">Manage farmer profiles and contact information</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-wrap">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`${t('search')} farmers by name or location...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-farmers"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-farmer">
              <Plus className="h-4 w-4" />
              {t('addFarmer')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('addFarmer')}</DialogTitle>
              <DialogDescription>
                Enter farmer details to add them to the monitoring system
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Rodriguez" {...field} data-testid="input-farmer-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} data-testid="input-farmer-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('location')}</FormLabel>
                      <FormControl>
                        <Input placeholder="San Jose, Costa Rica" {...field} data-testid="input-farmer-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!showLocationHelper ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('latitude')}</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.000001" placeholder="9.9281" {...field} data-testid="input-farmer-latitude" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('longitude')}</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.000001" placeholder="-84.0907" {...field} data-testid="input-farmer-longitude" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLocationHelper(true)}
                      className="w-full"
                      data-testid="button-location-helper"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {t('dontKnowCoordinates')} Find them
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3 p-4 border rounded-md bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{t('geocode')}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('enterAddress')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowLocationHelper(false)}
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={geocodeLocation}
                      disabled={isGeocoding}
                      className="w-full"
                      data-testid="button-geocode"
                    >
                      {isGeocoding ? t('geocoding') : t('geocode')}
                    </Button>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('language')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-farmer-language">
                            <SelectValue placeholder={t('language')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="hi">हिन्दी</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-farmer">
                    {createMutation.isPending ? `${t('addFarmer')}...` : t('addFarmer')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredFarmers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFarmers.map((farmer, index) => (
            <Card key={farmer.id} className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(farmer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg" data-testid={`text-farmer-name-${index}`}>{farmer.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        {languageLabels[farmer.language as Language]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      data-testid={`button-delete-farmer-${index}`}
                      onClick={() => deleteMutation.mutate(farmer.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{farmer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{farmer.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 flex items-center justify-center min-h-[300px]">
          <CardContent className="text-center p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">
                  {searchQuery ? "No farmers found" : "No farmers registered yet"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {searchQuery ? "Try adjusting your search" : "Click 'Add Farmer' to get started"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
