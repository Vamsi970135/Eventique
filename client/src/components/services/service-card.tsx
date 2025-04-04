import { Link } from "wouter";
import { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { generateStarRating } from "@/lib/utils";
import { Star } from "lucide-react";

// Extended service interface for the UI with optional properties added by API
interface ExtendedService extends Service {
  tags?: string[];
  eventTypes?: number[];
  owner?: any;
}

interface ServiceCardProps {
  service: ExtendedService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Get the primary image or use a default
  const primaryImage = service.images && service.images.length > 0
    ? service.images[0]
    : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

  // Get tags from the service if available
  const serviceTags = service.tags || [];

  return (
    <div className="card-maroon bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-[#d4af37]/20">
      {/* Gold accent line at top */}
      <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#f4c430] to-[#d4af37]"></div>

      <div className="flex"> {/* Added flex container for buttons */}
        <div className="p-2"> {/* Added padding for better spacing */}
          <button className="btn-back">Back</button> {/* Added back button */}
          <button className="btn-home">Home</button> {/* Added home button */}
        </div>
        <div className="relative flex-grow"> {/* Added flex-grow to allow image to expand */}
          <img 
            src={primaryImage || "https://placehold.co/600x400?text=Service+Image"} 
            alt={service.title} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Service+Image";
            }}
          />
          {service.rating !== undefined && service.rating !== null && (
            <div className="absolute top-0 right-0 m-2">
              <span className="bg-white px-2 py-1 rounded-md font-bold text-sm flex items-center shadow-sm border border-[#d4af37]/30" style={{color: 'var(--maroon-700)'}}>
                <Star className="h-4 w-4 mr-1 fill-[#f4c430]" /> 
                {service.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold" style={{color: 'var(--maroon-800)'}}>{service.title.replace('Wedding', 'Indian Wedding').replace('Catering', 'Indian Catering').replace('Eventease', 'Eventique')}</h3>
          <span className="text-lg font-semibold">₹{service.price}</span> {/* Updated currency */}
        </div>
        <p className="text-gray-800 text-sm mb-3">
          {(service.description.includes('Indian') ? service.description : 'Traditional Indian ' + service.description).length > 60
            ? `${(service.description.includes('Indian') ? service.description : 'Traditional Indian ' + service.description).substring(0, 60)}...`
            : (service.description.includes('Indian') ? service.description : 'Traditional Indian ' + service.description)}
        </p>
        <div className="flex items-center mb-3 flex-wrap">
          {Array.isArray(serviceTags) && serviceTags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag-maroon mr-2 mb-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-800 mb-3">
          {service.location && (
            <span className="flex items-center">
              <span className="mr-1 icon-shape" style={{color: 'var(--maroon-700)'}}>📍</span> 
              {service.location.replace(/New York/g, 'Mumbai')
                .replace(/Los Angeles/g, 'Delhi')
                .replace(/Chicago/g, 'Bangalore')
                .replace(/San Francisco/g, 'Kolkata')
                .replace(/Boston/g, 'Chennai')
                .replace(/Seattle/g, 'Hyderabad')
                .replace(/Austin/g, 'Jaipur')
                .replace(/Dallas/g, 'Ahmedabad')
                .replace(/Washington/g, 'Pune')}
            </span>
          )}
        </div>
        <Link href={`/services/${service.id}`}>
          <Button className="w-full btn-primary font-semibold border border-[#d4af37] group hover:border-[#f4c430] transition-all duration-300">
            <span className="mr-2">✦</span>
            View Details
            <span className="ml-2">✦</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}