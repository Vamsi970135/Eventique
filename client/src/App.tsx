import React from 'react';
import { Switch, Route } from "wouter";
import { ArrowLeft, Home } from 'lucide-react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ServicesPage from "@/pages/services-page";
import ServiceDetailsPage from "@/pages/service-details-page";
import { ProtectedRoute } from "./lib/protected-route";
import CustomerDashboard from "@/pages/dashboard/customer-dashboard";
import BusinessDashboard from "@/pages/dashboard/business-dashboard";
import AddService from "@/pages/dashboard/add-service";
import Bookings from "@/pages/dashboard/bookings";
import Messages from "@/pages/dashboard/messages";
import EventsPage from "@/pages/events-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:id" component={ServiceDetailsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard/customer" component={CustomerDashboard} userType="customer" />
      <ProtectedRoute path="/dashboard/business" component={BusinessDashboard} userType="business" />
      <ProtectedRoute path="/dashboard/add-service" component={AddService} userType="business" />
      <ProtectedRoute path="/dashboard/bookings" component={Bookings} userType="both" />
      <ProtectedRoute path="/dashboard/messages" component={Messages} userType="both" />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app-container text-gray-800 bg-gray-50">
          <Router />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
