import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Create a navigate function equivalent for wouter
const useNavigate = () => {
  const [, setLocation] = useLocation();
  return (to: string) => setLocation(to);
};
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Schema for login form
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Schema for registration form
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().optional(),
  userType: z.enum(["customer", "business"]),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    // If userType is business, businessName is required
    if (data.userType === "business") {
      return !!data.businessName;
    }
    return true;
  },
  {
    message: "Business name is required for business accounts",
    path: ["businessName"],
  }
);

export default function AuthPage() {
  const [location] = useLocation();
  const navigate = useNavigate();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<"customer" | "business">("customer");

  // Get parameters from URL (for tab selection)
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const registerParam = searchParams.get("register");
  const typeParam = searchParams.get("type");

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      if (user.userType === "customer") {
        navigate("/dashboard/customer");
      } else {
        navigate("/dashboard/business");
      }
    }

    // Set active tab based on URL parameters
    if (registerParam === "true") {
      setActiveTab("register");
    }

    // Set user type based on URL parameters
    if (typeParam === "business") {
      setUserType("business");
    }
  }, [user, registerParam, typeParam, navigate]);

  // Set up forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      userType: userType,
      businessName: "",
      businessDescription: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  // Handle form submissions
  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    // Remove confirmPassword as it's not needed in the API
    const { confirmPassword, ...registrationData } = values;
    registerMutation.mutate(registrationData);
  };

  // Update user type in form when it changes
  useEffect(() => {
    registerForm.setValue("userType", userType);
  }, [userType, registerForm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Auth Forms */}
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle>Login to your account</CardTitle>
                      <CardDescription>
                        Enter your credentials to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-sm text-neutral-500">
                        Don't have an account?{" "}
                        <a 
                          className="text-primary cursor-pointer hover:underline" 
                          onClick={() => setActiveTab("register")}
                        >
                          Register
                        </a>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>
                        Enter your details to create your EventEase account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">I am a:</h3>
                        <div className="flex gap-4">
                          <Button 
                            type="button" 
                            variant={userType === "customer" ? "default" : "outline"}
                            onClick={() => setUserType("customer")}
                            className="flex-1"
                          >
                            Customer
                          </Button>
                          <Button 
                            type="button" 
                            variant={userType === "business" ? "default" : "outline"}
                            onClick={() => setUserType("business")}
                            className="flex-1"
                          >
                            Business Owner
                          </Button>
                        </div>
                      </div>
                      
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Business-specific fields */}
                          {userType === "business" && (
                            <>
                              <div className="pt-2 border-t">
                                <h3 className="font-medium mb-2">Business Information</h3>
                              </div>
                              
                              <FormField
                                control={registerForm.control}
                                name="businessName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your Business Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="businessDescription"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Business Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Brief description of your business" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123 Main Street" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid md:grid-cols-3 gap-4">
                                <FormField
                                  control={registerForm.control}
                                  name="city"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>City</FormLabel>
                                      <FormControl>
                                        <Input placeholder="City" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={registerForm.control}
                                  name="state"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>State</FormLabel>
                                      <FormControl>
                                        <Input placeholder="State" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={registerForm.control}
                                  name="zip"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>ZIP Code</FormLabel>
                                      <FormControl>
                                        <Input placeholder="12345" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </>
                          )}
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-sm text-neutral-500">
                        Already have an account?{" "}
                        <a 
                          className="text-primary cursor-pointer hover:underline" 
                          onClick={() => setActiveTab("login")}
                        >
                          Login
                        </a>
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Information Side */}
            <div className="hidden md:block bg-secondary text-white rounded-lg p-8 self-start">
              <h2 className="text-3xl font-bold mb-4">Welcome to EventEase</h2>
              <p className="mb-6 text-neutral-100">
                Your one-stop platform for finding and booking event services.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Why join EventEase?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-white text-primary p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Access thousands of trusted event service providers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white text-primary p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Easily compare services, ratings, and prices</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white text-primary p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Book and manage all your event services in one place</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white text-primary p-1 rounded-full mr-3 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Direct communication with service providers</span>
                  </li>
                </ul>
              </div>
              
              {activeTab === "register" && userType === "business" && (
                <div className="bg-primary/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">For Business Owners</h3>
                  <p className="text-sm text-neutral-100">
                    Join our platform to reach more customers, manage bookings efficiently, and grow your event services business.
                  </p>
                </div>
              )}
              
              <p className="mt-8 text-sm text-neutral-300">
                By joining EventEase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
