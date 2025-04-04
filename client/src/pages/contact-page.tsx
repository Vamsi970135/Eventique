import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube 
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contactInfo = [
  { 
    icon: <MapPin className="h-5 w-5" />, 
    title: "Our Location", 
    details: ["Cyber Hub, DLF Cyber City", "Gurugram, Haryana 122002", "India"] 
  },
  { 
    icon: <Phone className="h-5 w-5" />, 
    title: "Phone Number", 
    details: ["+91 98765 43210", "+91 11234 56789"] 
  },
  { 
    icon: <Mail className="h-5 w-5" />, 
    title: "Email Address", 
    details: ["support@eventease.com", "info@eventease.com"] 
  },
  { 
    icon: <Clock className="h-5 w-5" />, 
    title: "Working Hours", 
    details: ["Monday - Friday: 9:00 AM - 8:00 PM", "Saturday: 10:00 AM - 6:00 PM"] 
  }
];

const socialMedia = [
  { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "#" },
  { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "#" },
  { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "#" },
  { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", url: "#" },
  { icon: <Youtube className="h-5 w-5" />, name: "YouTube", url: "#" }
];

const serviceLocations = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Ahmedabad",
  "Goa"
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "",
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message || !formData.userType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        userType: "",
        location: ""
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions about our platform, need assistance with your account, or interested in becoming a service provider?
          We're here to help! Reach out to our friendly team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          
          {contactInfo.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="shrink-0 rounded-full bg-primary/10 p-3 mt-1">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                {item.details.map((detail, idx) => (
                  <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Social Media Links */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4 flex-wrap">
              {socialMedia.map((platform, index) => (
                <a 
                  key={index}
                  href={platform.url}
                  className="rounded-full bg-primary/10 p-3 text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                  aria-label={platform.name}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userType">I am a*</Label>
                    <RadioGroup 
                      value={formData.userType} 
                      onValueChange={handleRadioChange}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="customer" id="customer" />
                        <Label htmlFor="customer">Customer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="service_provider" id="service_provider" />
                        <Label htmlFor="service_provider">Service Provider</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name*</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={formData.location} 
                        onValueChange={(value) => handleSelectChange("location", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message*</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5} 
                      placeholder="Please provide details about your inquiry..." 
                      required 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Location</h2>
        <div className="rounded-lg overflow-hidden shadow-md h-96">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2183481950844!2d77.0878!3d28.4940!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19c631b55349%3A0xb9f64c193d66435c!2sDLF%20Cyber%20City%2C%20DLF%20Phase%202%2C%20Sector%2024%2C%20Gurugram%2C%20Haryana%20122002!5e0!3m2!1sen!2sin!4v1627309928521!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            title="Event Ease Office Location"
          ></iframe>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">
            Quick answers to common questions about our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">How do I become a service provider?</h3>
              <p className="text-muted-foreground">
                Sign up for a business account, complete your profile with details about your services, pricing, and portfolio, and start receiving booking requests from customers.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">How are payments processed?</h3>
              <p className="text-muted-foreground">
                We offer secure payment options including credit/debit cards, UPI, net banking, and wallet payments. All transactions are encrypted and processed securely.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">What happens if I need to cancel a booking?</h3>
              <p className="text-muted-foreground">
                Each service provider has their own cancellation policy. You can find this information on their profile page. If you need to cancel, please contact us as soon as possible.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Are the vendors verified?</h3>
              <p className="text-muted-foreground">
                Yes, all vendors go through a verification process before being listed on our platform. We check their credentials, experience, and review customer feedback regularly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}