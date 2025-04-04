import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Service, Category, EventType } from "@shared/schema";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ServiceCard from "@/components/services/service-card";
import ServiceFilter from "@/components/services/service-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ServicesPage() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Parse URL params
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryParam = searchParams.get("category");
  const eventTypeParam = searchParams.get("eventType");
  const queryParam = searchParams.get("q");
  const locationParam = searchParams.get("location");

  // Set initial search query from URL params
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Create query object based on URL params
  const queryParams: Record<string, any> = {};
  if (categoryParam) queryParams.categoryId = parseInt(categoryParam);
  if (eventTypeParam) queryParams.eventTypeId = parseInt(eventTypeParam);

  // Fetch services based on params
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services', queryParams],
  });

  // Fetch categories and event types for titles
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: eventTypes } = useQuery<EventType[]>({
    queryKey: ['/api/event-types'],
  });

  // Get category or event type name from ID
  const getCategoryName = (id: string) => {
    if (!categories) return "";
    const category = categories.find(c => c.id === parseInt(id));
    return category ? category.name : "";
  };

  const getEventTypeName = (id: string) => {
    if (!eventTypes) return "";
    const eventType = eventTypes.find(et => et.id === parseInt(id));
    return eventType ? eventType.name : "";
  };

  // Generate page title based on filters
  const getPageTitle = () => {
    if (categoryParam) {
      return `${getCategoryName(categoryParam)} Services`;
    } else if (eventTypeParam) {
      return `Services for ${getEventTypeName(eventTypeParam)}`;
    } else if (queryParam) {
      return `Search Results for "${queryParam}"`;
    } else if (locationParam) {
      return `Event Services in ${locationParam}`;
    } else {
      return "All Event Services";
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(location.split("?")[1] || "");
    if (searchQuery) {
      currentParams.set("q", searchQuery);
    } else {
      currentParams.delete("q");
    }
    
    const newLocation = `/services?${currentParams.toString()}`;
    window.history.pushState({}, "", newLocation);
    // Refresh services (would actually be handled by router change in real app)
    window.location.href = newLocation;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    className="w-full pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="absolute right-1 top-1">
                    Search
                  </Button>
                </div>
              </form>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="sm:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <ServiceFilter />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Filters - Desktop */}
            <div className="hidden sm:block w-full sm:w-64 lg:w-72 shrink-0">
              <ServiceFilter />
            </div>

            {/* Services */}
            <div className="flex-1">
              {/* Active filters */}
              {(categoryParam || eventTypeParam || queryParam || locationParam) && (
                <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Active Filters:</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-sm" 
                      onClick={() => {
                        window.location.href = "/services";
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categoryParam && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Category: {getCategoryName(categoryParam)}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => {
                          const params = new URLSearchParams(location.split("?")[1] || "");
                          params.delete("category");
                          window.location.href = `/services?${params.toString()}`;
                        }} />
                      </div>
                    )}
                    {eventTypeParam && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Event: {getEventTypeName(eventTypeParam)}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => {
                          const params = new URLSearchParams(location.split("?")[1] || "");
                          params.delete("eventType");
                          window.location.href = `/services?${params.toString()}`;
                        }} />
                      </div>
                    )}
                    {queryParam && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Search: {queryParam}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => {
                          const params = new URLSearchParams(location.split("?")[1] || "");
                          params.delete("q");
                          window.location.href = `/services?${params.toString()}`;
                        }} />
                      </div>
                    )}
                    {locationParam && (
                      <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Location: {locationParam}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => {
                          const params = new URLSearchParams(location.split("?")[1] || "");
                          params.delete("location");
                          window.location.href = `/services?${params.toString()}`;
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Results */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-md h-72 animate-pulse"></div>
                  ))}
                </div>
              ) : services && services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No services found</h3>
                  <p className="text-neutral-500 mb-4">
                    We couldn't find any services matching your criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.location.href = "/services";
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
