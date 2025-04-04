import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Clock, ListChecks, MessageSquare, Search, Star } from "lucide-react";
import { formatDate, getStatusColor, getStatusText } from "@/lib/utils";
import { Booking, Message } from "@shared/schema";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Fetch bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery<any[]>({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });
  
  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ['/api/messages'],
    enabled: !!user,
  });
  
  // Format data
  const upcomingBookings = bookings?.filter(b => 
    (b.status === "confirmed" || b.status === "pending") && 
    new Date(b.eventDate) >= new Date()
  ) || [];
  
  const pastBookings = bookings?.filter(b => 
    b.status === "completed" || new Date(b.eventDate) < new Date()
  ) || [];
  
  const unreadMessages = messages?.filter(m => m.unreadCount > 0).length || 0;
  
  if (!user || user.userType !== "customer") {
    return null; // Protected route will handle the redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.firstName}!</h1>
            <p className="text-neutral-600">Manage your event services and bookings</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Upcoming Bookings</p>
                  <p className="text-3xl font-bold">{upcomingBookings.length}</p>
                </div>
                <CalendarCheck className="h-10 w-10 text-primary/40" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Completed Bookings</p>
                  <p className="text-3xl font-bold">{pastBookings.length}</p>
                </div>
                <ListChecks className="h-10 w-10 text-primary/40" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Unread Messages</p>
                  <p className="text-3xl font-bold">{unreadMessages}</p>
                </div>
                <MessageSquare className="h-10 w-10 text-primary/40" />
              </CardContent>
            </Card>
            
            <Card className="bg-primary text-white">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-80 mb-1">Find Services</p>
                  <p className="text-lg font-semibold">Browse Services</p>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate("/services")}
                  className="bg-white text-primary hover:bg-neutral-100"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Explore
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Bookings */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="upcoming" className="flex-1">Upcoming Bookings</TabsTrigger>
                  <TabsTrigger value="past" className="flex-1">Past Bookings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6 h-32"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center mb-2">
                                  <h3 className="font-semibold text-lg mr-3">{booking.service.title}</h3>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusText(booking.status)}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-neutral-600 mb-4">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{formatDate(new Date(booking.eventDate))}</span>
                                </div>
                                {booking.notes && (
                                  <p className="text-neutral-600 text-sm mb-4">
                                    <span className="font-medium">Notes:</span> {booking.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/services/${booking.service.id}`)}
                                >
                                  View Service
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => navigate(`/dashboard/messages?user=${booking.service.userId}`)}
                                >
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-neutral-500 mb-4">You don't have any upcoming bookings.</p>
                        <Button onClick={() => navigate("/services")}>
                          Browse Services
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6 h-32"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : pastBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center mb-2">
                                  <h3 className="font-semibold text-lg mr-3">{booking.service.title}</h3>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusText(booking.status)}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-neutral-600 mb-2">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{formatDate(new Date(booking.eventDate))}</span>
                                </div>
                              </div>
                              <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/services/${booking.service.id}`)}
                                >
                                  View Service
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center"
                                  onClick={() => navigate(`/services/${booking.service.id}?tab=reviews`)}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Leave Review
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-neutral-500">You don't have any past bookings.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Recent Messages & Quick Actions */}
            <div className="space-y-6">
              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>
                    Your conversations with service providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-neutral-100 p-4 rounded-lg h-16"></div>
                      ))}
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.slice(0, 3).map((conversation) => (
                        <div key={conversation.otherUser.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                                {conversation.otherUser.profileImage ? (
                                  <img 
                                    src={conversation.otherUser.profileImage} 
                                    alt={conversation.otherUser.firstName} 
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-neutral-500 text-sm font-semibold">
                                    {conversation.otherUser.firstName[0]}{conversation.otherUser.lastName[0]}
                                  </span>
                                )}
                              </div>
                              {conversation.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {conversation.otherUser.businessName || 
                                 `${conversation.otherUser.firstName} ${conversation.otherUser.lastName}`}
                              </h4>
                              <p className="text-xs text-neutral-500 truncate max-w-[150px]">
                                {conversation.lastMessage?.content?.substring(0, 20)}...
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => navigate(`/dashboard/messages?user=${conversation.otherUser.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-neutral-500 text-sm">
                        No messages yet. Contact a service provider to start a conversation.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/dashboard/messages")}
                  >
                    View All Messages
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate("/services")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find New Services
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate("/dashboard/bookings")}
                  >
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Manage Bookings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate("/dashboard/messages")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                    {unreadMessages > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
