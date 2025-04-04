import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar,
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  Star, 
  MoreHorizontal 
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, getStatusColor, getStatusText } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Bookings() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery<any[]>({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });

  // Format bookings by status
  const pendingBookings = bookings?.filter(b => b.status === "pending") || [];
  const confirmedBookings = bookings?.filter(b => 
    b.status === "confirmed" && new Date(b.eventDate) >= new Date()
  ) || [];
  const completedBookings = bookings?.filter(b => 
    b.status === "completed" || (b.status === "confirmed" && new Date(b.eventDate) < new Date())
  ) || [];
  const cancelledBookings = bookings?.filter(b => b.status === "cancelled") || [];

  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking updated",
        description: "The booking status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      setConfirmDialogOpen(false);
      setCancelDialogOpen(false);
      setCompleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateBookingStatusMutation.mutate({ id, status });
  };

  // Check if user has permission to update this booking
  const canUpdateBooking = (booking: any) => {
    if (!user) return false;
    
    if (user.userType === "customer") {
      return booking.userId === user.id;
    } else if (user.userType === "business") {
      // Business owners can update bookings for their services
      return booking.service.userId === user.id;
    }
    
    return false;
  };

  // Booking action buttons based on status and user type
  const renderBookingActions = (booking: any) => {
    if (!canUpdateBooking(booking)) {
      return null;
    }
    
    if (user?.userType === "business") {
      if (booking.status === "pending") {
        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setSelectedBooking(booking);
                setConfirmDialogOpen(true);
              }}
            >
              Accept
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                setSelectedBooking(booking);
                setCancelDialogOpen(true);
              }}
            >
              Decline
            </Button>
          </div>
        );
      } else if (booking.status === "confirmed") {
        return (
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => {
                setSelectedBooking(booking);
                setCompleteDialogOpen(true);
              }}
            >
              Mark Complete
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                setSelectedBooking(booking);
                setCancelDialogOpen(true);
              }}
            >
              Cancel
            </Button>
          </div>
        );
      }
    } else if (user?.userType === "customer") {
      if (booking.status === "pending" || booking.status === "confirmed") {
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              setSelectedBooking(booking);
              setCancelDialogOpen(true);
            }}
          >
            Cancel Booking
          </Button>
        );
      }
    }
    
    return null;
  };

  // Display empty state if no bookings
  const renderEmptyState = () => (
    <Card>
      <CardContent className="p-6 text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
        <h3 className="text-lg font-medium mb-2">No bookings found</h3>
        <p className="text-neutral-500 mb-4">
          {user?.userType === "customer" 
            ? "You haven't made any bookings yet. Browse services to book your first event service."
            : "You don't have any bookings for your services yet."}
        </p>
        {user?.userType === "customer" && (
          <Button onClick={() => navigate("/services")}>
            Browse Services
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Render booking card
  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
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
            
            {user?.userType === "business" ? (
              <p className="text-sm mb-2">
                <span className="font-medium">Customer:</span> {booking.customer.firstName} {booking.customer.lastName}
              </p>
            ) : (
              <p className="text-sm mb-2">
                <span className="font-medium">Service Provider:</span> {booking.service.owner?.businessName || "Service Provider"}
              </p>
            )}
            
            {booking.notes && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Notes:</span>
                <p className="text-neutral-600 mt-1">{booking.notes}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 mt-4 md:mt-0">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/services/${booking.service.id}`)}
              >
                View Service
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate(`/dashboard/messages?user=${user?.userType === "customer" ? booking.service.userId : booking.userId}`)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
            
            <div className="flex-1 md:flex-none mt-2 md:mt-3 w-full md:w-auto">
              {renderBookingActions(booking)}
            </div>
            
            {user?.userType === "customer" && booking.status === "completed" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center mt-2"
                onClick={() => navigate(`/services/${booking.service.id}?tab=reviews`)}
              >
                <Star className="h-4 w-4 mr-1" />
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2"
              onClick={() => navigate(user?.userType === "customer" ? "/dashboard/customer" : "/dashboard/business")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
            <p className="text-neutral-600">
              {user?.userType === "customer" 
                ? "View and manage all your event service bookings" 
                : "View and manage customer bookings for your services"}
            </p>
          </div>
          
          {/* Bookings Tabs */}
          <Tabs defaultValue={pendingBookings.length > 0 ? "pending" : "confirmed"} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="pending" className="flex-1">
                Pending
                {pendingBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{pendingBookings.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex-1">
                Confirmed
                {confirmedBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{confirmedBookings.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Completed
                {completedBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{completedBookings.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1">
                Cancelled
                {cancelledBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{cancelledBookings.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6 h-32"></CardContent>
                    </Card>
                  ))}
                </div>
              ) : pendingBookings.length > 0 ? (
                <div className="space-y-4">
                  {pendingBookings.map(booking => renderBookingCard(booking))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </TabsContent>
            
            <TabsContent value="confirmed">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6 h-32"></CardContent>
                    </Card>
                  ))}
                </div>
              ) : confirmedBookings.length > 0 ? (
                <div className="space-y-4">
                  {confirmedBookings.map(booking => renderBookingCard(booking))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6 h-32"></CardContent>
                    </Card>
                  ))}
                </div>
              ) : completedBookings.length > 0 ? (
                <div className="space-y-4">
                  {completedBookings.map(booking => renderBookingCard(booking))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </TabsContent>
            
            <TabsContent value="cancelled">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6 h-32"></CardContent>
                    </Card>
                  ))}
                </div>
              ) : cancelledBookings.length > 0 ? (
                <div className="space-y-4">
                  {cancelledBookings.map(booking => renderBookingCard(booking))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Confirm Booking Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this booking request?
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <p className="font-medium">{selectedBooking.service.title}</p>
              <p className="text-sm text-neutral-600 mt-1">
                <Clock className="h-4 w-4 inline mr-1" />
                {formatDate(new Date(selectedBooking.eventDate))}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Customer:</span> {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedBooking && handleStatusChange(selectedBooking.id, "confirmed")}
              disabled={updateBookingStatusMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateBookingStatusMutation.isPending ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking?
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <p className="font-medium">{selectedBooking.service.title}</p>
              <p className="text-sm text-neutral-600 mt-1">
                <Clock className="h-4 w-4 inline mr-1" />
                {formatDate(new Date(selectedBooking.eventDate))}
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                Current status: <Badge className={getStatusColor(selectedBooking.status)}>
                  {getStatusText(selectedBooking.status)}
                </Badge>
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
            >
              Go Back
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedBooking && handleStatusChange(selectedBooking.id, "cancelled")}
              disabled={updateBookingStatusMutation.isPending}
            >
              {updateBookingStatusMutation.isPending ? "Processing..." : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Complete Booking Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Booking as Completed</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this booking as completed?
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <p className="font-medium">{selectedBooking.service.title}</p>
              <p className="text-sm text-neutral-600 mt-1">
                <Clock className="h-4 w-4 inline mr-1" />
                {formatDate(new Date(selectedBooking.eventDate))}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Customer:</span> {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCompleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedBooking && handleStatusChange(selectedBooking.id, "completed")}
              disabled={updateBookingStatusMutation.isPending}
            >
              {updateBookingStatusMutation.isPending ? "Processing..." : "Mark as Completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
