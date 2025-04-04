import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
};

export default function EventsPage() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  
  const { data: eventTypes, isLoading: isLoadingEventTypes } = useQuery({
    queryKey: ["/api/event-types"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/event-types");
      return res.json();
    },
  });

  // Mock data for demonstration purposes
  useEffect(() => {
    // This would typically come from an API
    const mockEvents = [
      {
        id: 1,
        title: "Wedding Expo Delhi 2023",
        description: "Find everything you need for your wedding day under one roof. Meet top vendors and see the latest trends.",
        date: "2023-12-15",
        location: "Exhibition Center, Delhi",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        category: "Wedding"
      },
      {
        id: 2,
        title: "Corporate Event Planning Workshop",
        description: "Learn from industry experts how to plan and execute successful corporate events.",
        date: "2023-11-20",
        location: "Business Center, Mumbai",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "Corporate"
      },
      {
        id: 3,
        title: "Birthday Party Planning Masterclass",
        description: "Get creative ideas and practical tips for planning memorable birthday celebrations.",
        date: "2023-11-10",
        location: "Community Hall, Bangalore",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "Birthday"
      },
      {
        id: 4,
        title: "Destination Wedding Summit",
        description: "Explore exotic locations and learn about planning destination weddings in India and abroad.",
        date: "2023-12-05",
        location: "Luxury Hotel, Goa",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "Wedding"
      },
      {
        id: 5,
        title: "Wedding Photography Workshop",
        description: "Master the art of capturing wedding moments with expert photographers.",
        date: "2023-10-20",
        location: "Photography Studio, Chennai",
        image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "Wedding"
      },
      {
        id: 6,
        title: "Mehendi & Sangeet Planning",
        description: "Discover traditional and modern ideas for Mehendi and Sangeet ceremonies.",
        date: "2023-10-15",
        location: "Cultural Center, Jaipur",
        image: "https://images.unsplash.com/photo-1599739291060-4578e77dac5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "Wedding"
      }
    ];

    // Sort events into upcoming and past based on date
    const today = new Date();
    const upcoming: Event[] = [];
    const past: Event[] = [];

    mockEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= today) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Sort upcoming events by date (earliest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Sort past events by date (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, []);

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Events & Workshops
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover upcoming events, expos, and workshops related to event planning and services.
          Connect with professionals and enhance your event planning skills.
        </p>
      </div>

      {/* Event Type Categories */}
      {isLoadingEventTypes ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {eventTypes?.map((type: any) => (
            <div 
              key={type.id}
              className="relative overflow-hidden rounded-lg border group cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
              <img 
                src={type.image} 
                alt={type.name}
                className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-bold text-xl drop-shadow-md">{type.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Events */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Button variant="outline">View All</Button>
        </div>
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {event.category}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">Register Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Past Events</h2>
          <Button variant="outline">View All</Button>
        </div>
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map(event => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col opacity-80 hover:opacity-100 transition-opacity">
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    {event.category}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}