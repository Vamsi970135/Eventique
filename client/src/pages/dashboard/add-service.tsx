import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertServiceSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Image, Plus, X } from "lucide-react";
import { serviceCategories, eventTypes } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Extended service schema for the form
const serviceFormSchema = insertServiceSchema.extend({
  tags: z.array(z.string()).optional(),
  eventTypes: z.array(z.number()).optional(),
  images: z.array(z.string()).optional(),
}).omit({ userId: true });

export default function AddService() {
  const { user } = useAuth();
  const [, params] = useRoute<{ edit: string }>("/dashboard/add-service");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Query params for edit mode
  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get("edit");
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch event types
  const { data: eventTypesData } = useQuery({
    queryKey: ['/api/event-types'],
  });
  
  // Fetch service details if in edit mode
  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: [`/api/services/${editId}`],
    enabled: !!editId,
  });
  
  // Setup form with default values
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "$",
      priceDescription: "",
      location: "",
      categoryId: 1,
      featured: false,
      tags: [],
      eventTypes: [],
      images: [],
    },
  });
  
  // Update form with service data if in edit mode
  useEffect(() => {
    if (editId && serviceData) {
      setIsEditing(true);
      form.reset({
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        priceDescription: serviceData.priceDescription || "",
        location: serviceData.location || "",
        categoryId: serviceData.categoryId,
        featured: serviceData.featured,
        tags: serviceData.tags || [],
        eventTypes: serviceData.eventTypes || [],
        images: serviceData.images || [],
      });
    }
  }, [editId, serviceData, form]);
  
  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof serviceFormSchema>) => {
      const response = await apiRequest("POST", "/api/services", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service created successfully",
        description: "Your service is now visible to customers",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business/services'] });
      navigate("/dashboard/business");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create service",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof serviceFormSchema>) => {
      const response = await apiRequest("PUT", `/api/services/${editId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service updated successfully",
        description: "Your changes have been saved",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/business/services'] });
      queryClient.invalidateQueries({ queryKey: [`/api/services/${editId}`] });
      navigate("/dashboard/business");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update service",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    if (isEditing) {
      updateServiceMutation.mutate(values);
    } else {
      createServiceMutation.mutate(values);
    }
  };
  
  // Handle adding a tag
  const addTag = () => {
    if (tag.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tag.trim())) {
        form.setValue("tags", [...currentTags, tag.trim()]);
      }
      setTag("");
    }
  };
  
  // Handle removing a tag
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(t => t !== tagToRemove));
  };
  
  // Handle adding an image URL
  const addImageUrl = () => {
    if (imageUrl.trim()) {
      const currentImages = form.getValues("images") || [];
      if (!currentImages.includes(imageUrl.trim())) {
        form.setValue("images", [...currentImages, imageUrl.trim()]);
      }
      setImageUrl("");
    }
  };
  
  // Handle removing an image URL
  const removeImageUrl = (urlToRemove: string) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter(url => url !== urlToRemove));
  };
  
  // Toggle event type selection
  const toggleEventType = (eventTypeId: number) => {
    const currentEventTypes = form.getValues("eventTypes") || [];
    if (currentEventTypes.includes(eventTypeId)) {
      form.setValue("eventTypes", currentEventTypes.filter(id => id !== eventTypeId));
    } else {
      form.setValue("eventTypes", [...currentEventTypes, eventTypeId]);
    }
  };
  
  if (!user || user.userType !== "business") {
    return null; // Protected route will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-2"
                onClick={() => navigate("/dashboard/business")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">
                {isEditing ? "Edit Service" : "Add New Service"}
              </h1>
              <p className="text-neutral-600">
                {isEditing 
                  ? "Update your service details to attract more customers" 
                  : "Fill in the details below to list your service"}
              </p>
            </div>
            
            {/* Service Form */}
            {serviceLoading && isEditing ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-neutral-200 rounded-md w-full"></div>
                <div className="h-32 bg-neutral-200 rounded-md w-full"></div>
                <div className="h-10 bg-neutral-200 rounded-md w-full"></div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Provide the essential details about your service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Professional Photography Services" {...field} />
                            </FormControl>
                            <FormDescription>
                              A clear, concise title for your service
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your service in detail..."
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Explain what you offer, your experience, and what makes your service unique
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Range</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a price range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="$">$ - Budget-friendly</SelectItem>
                                  <SelectItem value="$$">$$ - Mid-range</SelectItem>
                                  <SelectItem value="$$$">$$$ - Premium</SelectItem>
                                  <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Indicate the general price level of your service
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="priceDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Details (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Starting from $200 per hour" {...field} />
                              </FormControl>
                              <FormDescription>
                                Provide more specific pricing information
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. New York City" {...field} />
                              </FormControl>
                              <FormDescription>
                                Where do you provide this service?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value?.toString()}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {(categories || serviceCategories).map((category) => (
                                    <SelectItem 
                                      key={category.id} 
                                      value={category.id.toString()}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the category that best fits your service
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Details</CardTitle>
                      <CardDescription>
                        Add more specific details to help customers find your service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Event Types */}
                      <div>
                        <FormLabel className="text-base">Event Types</FormLabel>
                        <FormDescription className="mb-3">
                          Select the types of events your service is suitable for
                        </FormDescription>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {(eventTypesData || eventTypes).map((eventType) => {
                            const isChecked = form.watch("eventTypes")?.includes(eventType.id) || false;
                            return (
                              <div key={eventType.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`event-type-${eventType.id}`} 
                                  checked={isChecked}
                                  onCheckedChange={() => toggleEventType(eventType.id)}
                                />
                                <Label 
                                  htmlFor={`event-type-${eventType.id}`}
                                  className="cursor-pointer"
                                >
                                  {eventType.name}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Service Tags */}
                      <div>
                        <FormLabel className="text-base">Service Tags</FormLabel>
                        <FormDescription className="mb-3">
                          Add tags to help customers discover your service
                        </FormDescription>
                        
                        <div className="flex items-center mb-2">
                          <Input 
                            placeholder="e.g. Outdoor, Portrait, Wedding"
                            className="mr-2"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={addTag}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.watch("tags")?.map((tag, index) => (
                            <div 
                              key={index} 
                              className="bg-neutral-100 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              <span>{tag}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {!form.watch("tags")?.length && (
                            <span className="text-sm text-neutral-500">No tags added yet</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Service Images */}
                      <div>
                        <FormLabel className="text-base">Service Images</FormLabel>
                        <FormDescription className="mb-3">
                          Add image URLs to showcase your work
                        </FormDescription>
                        
                        <div className="flex items-center mb-2">
                          <Input 
                            placeholder="Enter image URL"
                            className="mr-2"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addImageUrl();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={addImageUrl}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          {form.watch("images")?.map((url, index) => (
                            <div key={index} className="relative rounded-md overflow-hidden h-24 bg-neutral-100">
                              <img 
                                src={url} 
                                alt={`Service image ${index + 1}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Image+Error";
                                }}
                              />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImageUrl(url)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {!form.watch("images")?.length && (
                            <div className="border border-dashed border-neutral-300 rounded-md h-24 flex items-center justify-center text-neutral-500">
                              <div className="text-center">
                                <Image className="h-5 w-5 mx-auto mb-1" />
                                <span className="text-xs">No images added</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Featured Service Toggle */}
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Featured Service</FormLabel>
                              <FormDescription>
                                Request to have your service featured on the homepage
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("featured") && (
                        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Featured Service Request</AlertTitle>
                          <AlertDescription>
                            Your request to feature this service will be reviewed by our team. 
                            Featured services typically have excellent reviews and high-quality images.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate("/dashboard/business")}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                      >
                        {(createServiceMutation.isPending || updateServiceMutation.isPending) 
                          ? (isEditing ? "Updating..." : "Creating...") 
                          : (isEditing ? "Update Service" : "Create Service")}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
