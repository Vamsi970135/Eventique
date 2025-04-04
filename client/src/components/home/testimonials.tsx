
import { User } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Planner",
      content: "The platform has made it incredibly easy to find and book the right services for my clients' events.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Wedding Photographer",
      content: "As a service provider, I've been able to reach more clients and grow my business significantly.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Happy Customer",
      content: "Found the perfect vendor for my wedding. The whole process was smooth and stress-free.",
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">What Our Users Say</h2>
          <p className="text-neutral-500">Testimonials from our happy customers and service providers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-neutral-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-neutral-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
