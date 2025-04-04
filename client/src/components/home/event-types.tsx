import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { EventType } from "@shared/schema";

// Define an interface that ensures all event types have the same properties
interface DisplayEventType {
  id: number;
  name: string;
  image: string;
  description?: string | null;
}

export default function EventTypes() {
  const { data: eventTypes, isLoading } = useQuery<EventType[]>({
    queryKey: ['/api/event-types'],
  });

  // Indian event types for display
  const fallbackEventTypes: DisplayEventType[] = [
    { id: 1, name: 'Indian Weddings', image: 'https://images.unsplash.com/photo-1617307332486-72a738e88cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Traditional Hindu, Muslim, Sikh & Christian ceremonies' },
    { id: 2, name: 'Corporate Events', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Professional services for business gatherings in Delhi, Mumbai & Bangalore' },
    { id: 3, name: 'Sangeet & Mehndi', image: 'https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Pre-wedding celebration with music, dance & henna art' },
    { id: 4, name: 'Haldi Ceremony', image: 'https://images.unsplash.com/photo-1623680621863-13425e85bf49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Traditional turmeric application ceremony' },
    { id: 5, name: 'Destination Weddings', image: 'https://images.unsplash.com/photo-1604537466158-719b1972feb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Celebrations in Goa, Rajasthan, Kerala & other scenic locations' },
    { id: 6, name: 'Festivals & Pujas', image: 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', description: 'Services for Diwali, Holi, Durga Puja & more' },
  ];
  
  // Fixed fallback images for common Indian event types when images are broken
  const getBackupImage = (eventName: string): string => {
    const backupImages: Record<string, string> = {
      'Indian Weddings': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Weddings': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Corporate Events': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Sangeet & Mehndi': 'https://images.unsplash.com/photo-1630343710506-89f8b9f21d31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Haldi Ceremony': 'https://images.unsplash.com/photo-1623680621863-13425e85bf49?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Destination Weddings': 'https://images.unsplash.com/photo-1604537466158-719b1972feb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Festivals & Pujas': 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Reception': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Engagement': 'https://images.unsplash.com/photo-1630278156268-3195776c4c35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Birthday': 'https://images.unsplash.com/photo-1623841675698-8a9d6a6a3879?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Anniversary': 'https://images.unsplash.com/photo-1630278156268-3195776c4c35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    };
    
    return backupImages[eventName] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
  };

  // Transform API data to ensure it matches our display format
  const processedEventTypes: DisplayEventType[] = eventTypes?.map(event => ({
    id: event.id,
    name: event.name,
    image: event.image || getBackupImage(event.name) || "https://placehold.co/600x400?text=Event+Type", // Use a backup image if null
    description: event.description
  })) || fallbackEventTypes;

  return (
    <section className="py-12 bg-neutral-50 indian-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Indian Celebrations</h2>
          <p className="text-neutral-600">Find specialized services for all traditional occasions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedEventTypes.map((eventType) => (
            <Link key={eventType.id} href={`/services?eventType=${eventType.id}`}>
              <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group block h-64 border border-[#d4af37]/30">
                {/* Gold pattern top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f4c430] to-[#d4af37] z-10"></div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#800000]/80 group-hover:from-black/20 group-hover:to-[#990000]/70 transition-all duration-300"></div>
                <img 
                  src={eventType.image} 
                  alt={`${eventType.name} event`} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = getBackupImage(eventType.name);
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#f4c430]">❈</span>
                    <h3 className="text-white text-xl font-bold drop-shadow-md">{eventType.name}</h3>
                    <span className="text-[#f4c430]">❈</span>
                  </div>
                  {eventType.description && (
                    <p className="text-white/90 text-sm mt-1 drop-shadow-lg">{eventType.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <a href="/services" className="inline-block px-6 py-2 bg-[#800000] text-white rounded-md hover:bg-[#990000] transition border border-[#d4af37] shadow-md">
            <span className="indian-decor">View All Event Types</span>
          </a>
        </div>
      </div>
    </section>
  );
}
