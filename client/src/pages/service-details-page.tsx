import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
// Create a navigate function equivalent for wouter
const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (to: string) => setLocation(to);
};
import { useAuth } from "@/hooks/use-auth";
import { Service, Review, insertReviewSchema, insertBookingSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, DollarSign, Mail, MapPin, Phone, Star } from "lucide-react";
import { getInitials, generateStarRating, getPriceRange, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Enhanced review form schema with rating
const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters" }).max(500),
});

// Booking form schema
const bookingFormSchema = z.object({
  eventDate: z.string().min(1, { message: "Event date is required" }),
  notes: z.string().max(500).optional(),
});

export default function ServiceDetailsPage() {
  const [match, params] = useRoute<{ id: string }>("/services/:id");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  // Fetch service details
  const { data: service, isLoading: serviceLoading } = useQuery<Service & { 
    tags: string[], 
    eventTypes: number[],
    owner: Omit<any, "password"> 
  }>({
    queryKey: [`/api/services/${params?.id}`],
    enabled: !!params?.id,
  });

  // Fetch service reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery<(Review & { 
    user: Omit<any, "password"> 
  })[]>({
    queryKey: [`/api/services/${params?.id}/reviews`],
    enabled: !!params?.id,
  });

  // Review form setup
  const reviewForm = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  // Booking form setup
  const bookingForm = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      eventDate: "",
      notes: "",
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewFormSchema>) => {
      const response = await apiRequest(
        "POST", 
        `/api/services/${params?.id}/reviews`, 
        data
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/services/${params?.id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/services/${params?.id}`] });
      reviewForm.reset();
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit booking mutation
  const submitBookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof bookingFormSchema>) => {
      const bookingData = {
        ...data,
        eventDate: new Date(data.eventDate),
      };
      
      const response = await apiRequest(
        "POST", 
        `/api/services/${params?.id}/book`, 
        bookingData
      );
      return response.json();
    },
    onSuccess: () => {
      setBookingDialogOpen(false);
      bookingForm.reset();
      toast({
        title: "Booking request sent",
        description: "The service provider will contact you soon!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle review form submission
  const onReviewSubmit = (values: z.infer<typeof reviewFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (user.userType !== "customer") {
      toast({
        title: "Not allowed",
        description: "Only customers can submit reviews",
        variant: "destructive",
      });
      return;
    }
    
    submitReviewMutation.mutate(values);
  };

  // Handle booking form submission
  const onBookingSubmit = (values: z.infer<typeof bookingFormSchema>) => {
    submitBookingMutation.mutate(values);
  };

  // Handle star rating selection
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    reviewForm.setValue("rating", rating);
  };

  if (!match) {
    navigate("/not-found");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {serviceLoading ? (
            <div className="animate-pulse bg-white rounded-lg p-8 mb-8"></div>
          ) : service ? (
            <>
              {/* Service Header */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {/* Image Gallery */}
                <div className="relative h-64 md:h-80 bg-neutral-200">
                  {service.images && service.images.length > 0 ? (
                    <img 
                      src={service.images[0]} 
                      alt={service.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-300">
                      <span className="text-neutral-500">No image available</span>
                    </div>
                  )}
                </div>
                
                {/* Service Info */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{service.title}</h1>
                      <div className="flex items-center mb-4">
                        <div className="flex text-amber-400 mr-2">
                          {generateStarRating(service.rating || 0).map(star => (
                            <i 
                              key={star.id} 
                              className={`${star.type === 'full' ? 'fas fa-star' : star.type === 'half' ? 'fas fa-star-half-alt' : 'far fa-star'} text-amber-400`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-neutral-600">
                          {(service.rating || 0).toFixed(1)} ({service.reviewCount || 0} reviews)
                        </span>
                      </div>
                      <p className="text-neutral-700 mb-4">{service.description}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.tags && Array.isArray(service.tags) && service.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-neutral-200 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price and Book Button */}
                    <div className="mt-4 md:mt-0 md:ml-4 md:min-w-48">
                      <div className="bg-neutral-100 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Price Range:</span>
                          <span className="font-bold">{service.price}</span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">
                          {getPriceRange(service.price)}
                        </p>
                        
                        {user && user.userType === "customer" && (
                          <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full">Book Now</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Book {service.title}</DialogTitle>
                                <DialogDescription>
                                  Fill out the details below to request a booking
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Form {...bookingForm}>
                                <form onSubmit={bookingForm.handleSubmit(onBookingSubmit)} className="space-y-4">
                                  <FormField
                                    control={bookingForm.control}
                                    name="eventDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Event Date</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="datetime-local" 
                                            {...field} 
                                            min={new Date().toISOString().slice(0, 16)}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          When would you like to book this service?
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={bookingForm.control}
                                    name="notes"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Special Requirements</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Any special requirements or notes for the service provider..."
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setBookingDialogOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      type="submit"
                                      disabled={submitBookingMutation.isPending}
                                    >
                                      {submitBookingMutation.isPending ? "Sending Request..." : "Send Booking Request"}
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {user && user.userType === "business" && (
                          <p className="text-sm text-center text-neutral-500 mt-2">
                            You are logged in as a business account
                          </p>
                        )}
                        
                        {!user && (
                          <div>
                            <Button 
                              className="w-full" 
                              onClick={() => navigate("/auth")}
                            >
                              Login to Book
                            </Button>
                            <p className="text-sm text-center text-neutral-500 mt-2">
                              You need to login to book this service
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Business Info */}
                  {service.owner && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-lg mb-3">About the Service Provider</h3>
                      <div className="flex items-start">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={service.owner.profileImage} />
                          <AvatarFallback>
                            {getInitials(service.owner.firstName, service.owner.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{service.owner.businessName || `${service.owner.firstName} ${service.owner.lastName}`}</h4>
                          <p className="text-sm text-neutral-600 mb-2">
                            Member since {service.owner.createdAt ? formatDate(new Date(service.owner.createdAt)) : "N/A"}
                          </p>
                          {service.owner.businessDescription && (
                            <p className="text-neutral-700 mb-3">{service.owner.businessDescription}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                            {service.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{service.location}</span>
                              </div>
                            )}
                            {user && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center"
                                onClick={() => navigate(`/dashboard/messages?user=${service.owner.id}`)}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                <span>Contact</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Reviews and Details Tabs */}
              <Tabs defaultValue="reviews" className="bg-white rounded-lg shadow-md overflow-hidden">
                <TabsList className="w-full border-b rounded-none p-0 h-auto">
                  <TabsTrigger value="reviews" className="flex-1 py-3 rounded-none">
                    Reviews ({service.reviewCount || 0})
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex-1 py-3 rounded-none">
                    Service Details
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="reviews" className="p-6">
                  {/* Review Form */}
                  {user && user.userType === "customer" && (
                    <Card className="mb-8">
                      <CardHeader>
                        <CardTitle className="text-lg">Leave a Review</CardTitle>
                        <CardDescription>
                          Share your experience with this service
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...reviewForm}>
                          <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-4">
                            <div className="mb-4">
                              <FormLabel>Your Rating</FormLabel>
                              <div className="flex items-center mt-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => handleRatingChange(rating)}
                                    className="text-2xl mr-1 focus:outline-none"
                                  >
                                    <Star 
                                      className={`h-6 w-6 ${rating <= selectedRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} 
                                    />
                                  </button>
                                ))}
                                <span className="ml-2 text-sm text-neutral-600">
                                  {selectedRating} out of 5 stars
                                </span>
                              </div>
                            </div>
                            
                            <FormField
                              control={reviewForm.control}
                              name="comment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Review</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Share your experience with this service provider..."
                                      {...field}
                                      rows={4}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit"
                              disabled={submitReviewMutation.isPending}
                            >
                              {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Review List */}
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Customer Reviews</h3>
                    
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse bg-neutral-100 p-4 rounded-lg h-32"></div>
                        ))}
                      </div>
                    ) : reviews && reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-start mb-3">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={review.user?.profileImage} />
                                <AvatarFallback>
                                  {getInitials(review.user?.firstName, review.user?.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium mr-2">
                                    {review.user?.firstName} {review.user?.lastName}
                                  </h4>
                                  <span className="text-xs text-neutral-500">
                                    {review.createdAt ? formatDate(new Date(review.createdAt)) : ""}
                                  </span>
                                </div>
                                <div className="flex text-amber-400 mt-1">
                                  {generateStarRating(review.rating || 0).map(star => (
                                    <i 
                                      key={star.id} 
                                      className={`${star.type === 'full' ? 'fas fa-star' : star.type === 'half' ? 'fas fa-star-half-alt' : 'far fa-star'} text-amber-400`}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-neutral-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-neutral-500">
                        <p>No reviews yet. Be the first to review this service!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Service Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Pricing</h4>
                            <p className="text-neutral-600">{service.price} - {getPriceRange(service.price)}</p>
                            {service.priceDescription && (
                              <p className="text-sm text-neutral-500 mt-1">{service.priceDescription}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Location</h4>
                            <p className="text-neutral-600">{service.location || "Available anywhere"}</p>
                          </div>
                        </div>
                        
                        {/* Event Types */}
                        {service.eventTypes && service.eventTypes.length > 0 && (
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Available for Events</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {service.eventTypes.map((eventTypeId, index) => {
                                  const eventTypeName = eventTypeId === 1 ? "Weddings" : 
                                                        eventTypeId === 2 ? "Birthdays" :
                                                        eventTypeId === 3 ? "Corporate Events" : "Social Gatherings";
                                  return (
                                    <span 
                                      key={index} 
                                      className="bg-neutral-200 px-3 py-1 rounded-full text-sm"
                                    >
                                      {eventTypeName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Business Hours & Contact</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Business Hours</h4>
                            <p className="text-neutral-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p className="text-neutral-600">Saturday: 10:00 AM - 4:00 PM</p>
                            <p className="text-neutral-600">Sunday: Closed</p>
                          </div>
                        </div>
                        
                        {service.owner && (
                          <>
                            {service.owner.phone && (
                              <div className="flex items-start">
                                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">Contact</h4>
                                  <p className="text-neutral-600">{service.owner.phone}</p>
                                  <p className="text-neutral-600">{service.owner.email}</p>
                                </div>
                              </div>
                            )}
                            
                            {user ? (
                              <Button 
                                className="mt-4" 
                                onClick={() => navigate(`/dashboard/messages?user=${service.owner.id}`)}
                              >
                                Contact via Messages
                              </Button>
                            ) : (
                              <Button 
                                className="mt-4" 
                                onClick={() => navigate("/auth")}
                              >
                                Login to Contact
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Service Not Found</h2>
              <p className="text-neutral-500 mb-4">
                The service you're looking for could not be found.
              </p>
              <Button onClick={() => navigate("/services")}>
                Browse All Services
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
