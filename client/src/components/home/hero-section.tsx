import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";

// Create a navigate function equivalent for wouter
const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (to: string) => setLocation(to);
};

export default function HeroSection() {
  const [searchParams, setSearchParams] = useState({
    query: "",
    location: "",
    date: ""
  });
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (searchParams.query) queryParams.append("q", searchParams.query);
    if (searchParams.location) queryParams.append("location", searchParams.location);
    if (searchParams.date) queryParams.append("date", searchParams.date);
    
    navigate(`/services?${queryParams.toString()}`);
  };
  
  return (
    <section className="relative bg-secondary text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1
        }}
      ></div>
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Perfect Services for Your Event</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Book photographers, decorators, venues, caterers and more for your special events</p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg p-2 md:p-3 shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 mb-2 md:mb-0 md:mr-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Search size={18} />
                  </span>
                  <Input 
                    type="text" 
                    name="query"
                    placeholder="What are you looking for?" 
                    className="w-full py-3 pl-10 pr-4 rounded-md border-0 focus:ring-2 focus:ring-primary text-secondary"
                    value={searchParams.query}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex-1 mb-2 md:mb-0 md:mr-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <MapPin size={18} />
                  </span>
                  <Input 
                    type="text" 
                    name="location"
                    placeholder="Location" 
                    className="w-full py-3 pl-10 pr-4 rounded-md border-0 focus:ring-2 focus:ring-primary text-secondary"
                    value={searchParams.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex-1 mb-2 md:mb-0 md:mr-2">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Calendar size={18} />
                  </span>
                  <Input 
                    type="date" 
                    name="date"
                    className="w-full py-3 pl-10 pr-4 rounded-md border-0 focus:ring-2 focus:ring-primary text-secondary"
                    value={searchParams.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto px-6 py-3">Search</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
