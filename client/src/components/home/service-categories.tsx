import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Camera, Utensils, Landmark, Paintbrush, Music, Lightbulb, Calendar, Video, Flower, Scissors } from "lucide-react";
import { Category } from "@shared/schema";

export default function ServiceCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getIconComponent = (iconName: string) => {
    const iconClass = "text-2xl logo-icon";
    
    switch (iconName) {
      case 'camera':
        return <Camera className={iconClass} />;
      case 'utensils':
        return <Utensils className={iconClass} />;
      case 'landmark':
        return <Landmark className={iconClass} />;
      case 'paint-brush':
        return <Paintbrush className={iconClass} />;
      case 'music':
        return <Music className={iconClass} />;
      case 'lightbulb':
        return <Lightbulb className={iconClass} />;
      case 'calendar':
        return <Calendar className={iconClass} />;
      case 'video':
        return <Video className={iconClass} />;
      case 'flower':
        return <Flower className={iconClass} />;
      case 'scissors':
        return <Scissors className={iconClass} />;
      default:
        return <Camera className={iconClass} />;
    }
  };

  // Indian-themed background images for each category
  const getCategoryBackground = (categoryName: string) => {
    const backgrounds: Record<string, string> = {
      'Photography': 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=500&q=80', // Wedding photography
      'Catering': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80', // Indian catering
      'Venues': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=80', // Wedding venue
      'Decoration': 'https://images.unsplash.com/photo-1602407294553-6ac9170c0be0?auto=format&fit=crop&w=500&q=80', // Wedding decoration
      'DJ & Music': 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=500&q=80', // DJ performance
      'Lighting': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=80', // Event lighting
      'Event Planning': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80', // Event planning
      'Videography': 'https://images.unsplash.com/photo-1524512099866-c65c6bfb2617?auto=format&fit=crop&w=500&q=80', // Wedding videography
      'Florists': 'https://images.unsplash.com/photo-1561128290-005859246e06?auto=format&fit=crop&w=500&q=80', // Wedding flowers
      'Makeup & Hair': 'https://images.unsplash.com/photo-1560869713-da86a9ec4584?auto=format&fit=crop&w=500&q=80', // Bridal makeup
      'Mehendi': 'https://images.unsplash.com/photo-1580653346167-878e4dd51326?auto=format&fit=crop&w=500&q=80', // Mehendi art
      'Pandits & Priests': 'https://images.unsplash.com/photo-1583939178630-6be3c764e2f1?auto=format&fit=crop&w=500&q=80', // Wedding ceremony
      'Choreography': 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=500&q=80', // Dance
    };

    return backgrounds[categoryName] || 'https://images.unsplash.com/photo-1551606712-ce6c5ddaf232?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'; // General Indian celebration
  };

  return (
    <section className="py-12 bg-white indian-pattern">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Service Category</h2>
            <p className="text-neutral-500">Find the perfect service providers for your Indian celebration</p>
          </div>
          <Link href="/services">
            <span className="hidden md:block text-primary font-medium hover:underline indian-decor">View All Categories</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading ? (
            <>
              <div className="h-40 bg-neutral-100 animate-pulse rounded-lg"></div>
              <div className="h-40 bg-neutral-100 animate-pulse rounded-lg"></div>
              <div className="h-40 bg-neutral-100 animate-pulse rounded-lg"></div>
              <div className="h-40 bg-neutral-100 animate-pulse rounded-lg"></div>
              <div className="h-40 bg-neutral-100 animate-pulse rounded-lg"></div>
            </>
          ) : categories && categories.length > 0 ? (
            categories.map((category) => (
              <Link key={category.id} href={`/services?category=${category.id}`}>
                <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition cursor-pointer h-48">
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={getCategoryBackground(category.name)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-5 text-white">
                    <div className="bg-[#991b1b]/90 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mt-2 shadow-lg border border-[#fecaca]/30 group-hover:scale-105 transition-transform duration-300">
                      {getIconComponent(category.icon)}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-1 text-white drop-shadow-md">{category.name}</h3>
                      <p className="text-white/90 text-sm line-clamp-2 drop-shadow">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-5 text-center py-10">
              <p className="text-neutral-500">No categories found</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/services">
            <span className="md:hidden inline-block text-primary font-medium hover:underline">View All Categories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
