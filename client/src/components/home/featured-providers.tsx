import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/services/service-card";

// Import the ExtendedService interface from service-card
interface ExtendedService extends Service {
  tags?: string[];
  eventTypes?: number[];
  owner?: any;
}

export default function FeaturedProviders() {
  const { data: services, isLoading } = useQuery<ExtendedService[]>({
    queryKey: ['/api/services'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`${queryKey[0]}?featured=true`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Service Providers</h2>
            <p className="text-neutral-500">Top-rated professionals for your events</p>
          </div>
          <Link href="/services">
            <span className="hidden md:block text-primary font-medium hover:underline">View All</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <div className="h-80 bg-neutral-100 animate-pulse rounded-lg"></div>
              <div className="h-80 bg-neutral-100 animate-pulse rounded-lg"></div>
              <div className="h-80 bg-neutral-100 animate-pulse rounded-lg"></div>
            </>
          ) : services && services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-neutral-500">No featured services available at this time.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/services">
            <span className="md:hidden inline-block text-primary font-medium hover:underline">View All Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
