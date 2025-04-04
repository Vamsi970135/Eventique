import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

// Create a navigate function equivalent for wouter
const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (to: string) => setLocation(to);
};
import { Category, EventType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { serviceCategories, eventTypes } from "@/lib/utils";

export default function ServiceFilter() {
  const [location] = useLocation();
  const navigate = useNavigate();
  
  // Parse the current URL search params
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([1, 4]); // 1-4 representing $-$$$$
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories and event types
  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: eventTypesData } = useQuery<EventType[]>({
    queryKey: ['/api/event-types'],
  });

  // Initialize state from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([parseInt(categoryParam)]);
    }
    
    const eventTypeParam = searchParams.get("eventType");
    if (eventTypeParam) {
      setSelectedEventTypes([parseInt(eventTypeParam)]);
    }
    
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
    
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  // Handle category toggle
  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle event type toggle
  const handleEventTypeToggle = (eventTypeId: number) => {
    setSelectedEventTypes(prev => {
      if (prev.includes(eventTypeId)) {
        return prev.filter(id => id !== eventTypeId);
      } else {
        return [...prev, eventTypeId];
      }
    });
  };

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append("q", searchQuery);
    }
    
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(cat => params.append("category", cat.toString()));
    }
    
    if (selectedEventTypes.length > 0) {
      selectedEventTypes.forEach(type => params.append("eventType", type.toString()));
    }
    
    params.append("minPrice", priceRange[0].toString());
    params.append("maxPrice", priceRange[1].toString());
    
    navigate(`/services?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedEventTypes([]);
    setPriceRange([1, 4]);
    setSearchQuery("");
    navigate("/services");
  };

  // Display categories from API or fallback
  const displayCategories = categoriesData || serviceCategories;
  const displayEventTypes = eventTypesData || eventTypes;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-4">Filter Services</h3>
      
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories">
          <AccordionTrigger>Service Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {displayCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="eventTypes">
          <AccordionTrigger>Event Types</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {displayEventTypes.map((eventType) => (
                <div key={eventType.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`event-type-${eventType.id}`} 
                    checked={selectedEventTypes.includes(eventType.id)}
                    onCheckedChange={() => handleEventTypeToggle(eventType.id)}
                  />
                  <Label htmlFor={`event-type-${eventType.id}`} className="cursor-pointer">
                    {eventType.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 py-2">
              <Slider
                defaultValue={priceRange}
                max={4}
                min={1}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between text-sm">
                <span>Budget (${priceRange[0] === 1 ? "$" : ""})</span>
                <span>Premium (${priceRange[1] === 4 ? "$$$$" : "$".repeat(priceRange[1])})</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 space-y-3">
        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">Reset Filters</Button>
      </div>
    </div>
  );
}
