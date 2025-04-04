import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Users, Clock, Award, Star, ThumbsUp } from "lucide-react";

const stats = [
  { 
    title: "Trusted Vendors", 
    value: "500+", 
    icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
    description: "Verified service providers across India"
  },
  { 
    title: "Happy Customers", 
    value: "10,000+", 
    icon: <Users className="h-8 w-8 text-primary" />,
    description: "Successful events organized"
  },
  { 
    title: "Years of Experience", 
    value: "5+", 
    icon: <Clock className="h-8 w-8 text-primary" />,
    description: "Industry experience and expertise"
  },
  { 
    title: "Service Categories", 
    value: "20+", 
    icon: <Award className="h-8 w-8 text-primary" />,
    description: "Covering all your event needs"
  },
];

const team = [
  {
    name: "Arjun Mehta",
    position: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    bio: "Former event manager with 10+ years of experience planning luxury weddings and corporate events across India."
  },
  {
    name: "Priya Sharma",
    position: "Chief Marketing Officer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    bio: "Digital marketing expert with a passion for connecting clients with the perfect service providers for their special occasions."
  },
  {
    name: "Vikram Singh",
    position: "Head of Vendor Relations",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    bio: "Former wedding photographer who understands both customer needs and vendor challenges in the event industry."
  },
  {
    name: "Ananya Patel",
    position: "Customer Experience Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    bio: "Specialized in creating smooth customer journeys and ensuring every event planned through our platform exceeds expectations."
  }
];

const testimonials = [
  {
    quote: "We found our dream wedding photographer through Event Ease. The platform made it so simple to compare portfolios and prices.",
    author: "Riya & Siddharth",
    event: "Wedding in Mumbai"
  },
  {
    quote: "As a DJ, Event Ease has transformed my business. I'm getting quality bookings regularly and the platform handles payments seamlessly.",
    author: "DJ Aryan",
    event: "Service Provider"
  },
  {
    quote: "Event Ease helped us plan our daughter's 1st birthday party in just three days! All vendors were professional and reasonably priced.",
    author: "Meera Kapoor",
    event: "Birthday Party in Delhi"
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          About Event Ease
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          India's premier platform connecting event planners with trusted service providers.
          We're simplifying the event planning process one celebration at a time.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="mb-4 text-muted-foreground">
              Event Ease was born out of a personal challenge. After witnessing the struggle of planning his sister's wedding in 2018, our founder Arjun Mehta identified a clear gap in the market: the lack of a centralized platform to discover and book reliable event service providers in India.
            </p>
            <p className="mb-4 text-muted-foreground">
              What started as a simple directory of vendors in Delhi has grown into India's most comprehensive event service marketplace, connecting thousands of couples and event planners with photographers, caterers, decorators, venues, and more across the country.
            </p>
            <p className="text-muted-foreground">
              Today, Event Ease is revolutionizing how Indians plan celebrations - from grand weddings to intimate family gatherings, corporate events to festive celebrations - by making the process simpler, transparent, and more reliable.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Indian wedding celebration"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-20 py-10 bg-muted/30 rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Our Impact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Numbers that reflect our commitment to transforming event planning in India
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold mb-2 text-primary">{stat.value}</h3>
                <p className="font-semibold mb-2">{stat.title}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission and Values */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Our Mission & Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Guiding principles that drive everything we do
          </p>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-8 mb-10">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-center">
              To empower every Indian to create memorable celebrations by providing seamless access to trusted event service providers, innovative planning tools, and inspiration for every occasion.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trust & Reliability</h3>
            <p className="text-muted-foreground">
              We thoroughly vet all service providers on our platform to ensure quality, professionalism, and reliability.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Customer-Centric</h3>
            <p className="text-muted-foreground">
              Every feature we build is designed with our users' needs in mind, making event planning simpler and more enjoyable.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transparency</h3>
            <p className="text-muted-foreground">
              We promote clear pricing, honest reviews, and open communication between clients and service providers.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            The passionate individuals behind Event Ease
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-primary font-medium mb-2">{member.position}</p>
              <p className="text-muted-foreground text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">What People Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Hear from our customers and service providers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md bg-primary/5">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-20"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                  </svg>
                </div>
                <p className="text-center mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-center">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}