import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User, MessageSquare, Calendar, Home, Search, Info, Phone, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-primary/10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Link href="/">
              <button className="p-2 hover:bg-primary/10 rounded-full">
                <Home className="h-5 w-5" />
              </button>
            </Link>
          </div>

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-primary text-2xl font-bold">Eventique</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span className={`font-medium hover:text-primary cursor-pointer ${location === link.href ? 'text-primary' : ''}`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.userType === "customer" && (
                  <Link href="/dashboard/customer">
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.userType === "business" && (
                  <Link href="/dashboard/business">
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      Business Dashboard
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      {user.profileImage && <AvatarImage src={user.profileImage} />}
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user.firstName} {user.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={user.userType === "customer" ? "/dashboard/customer" : "/dashboard/business"}>
                        <div className="flex w-full cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/bookings">
                        <div className="flex w-full cursor-pointer">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Bookings</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/messages">
                        <div className="flex w-full cursor-pointer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Messages</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="hidden md:block">Login</Button>
                </Link>
                <Link href="/auth?register=true">
                  <Button className="hidden md:block">Sign Up</Button>
                </Link>
              </>
            )}
            <button className="md:hidden text-secondary text-xl" onClick={toggleMobileMenu}>
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <div 
                  className={`font-medium py-2 hover:text-primary flex items-center cursor-pointer ${location === link.href ? 'text-primary' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name === "Home" && <Home className="mr-2 h-4 w-4" />}
                  {link.name === "Events" && <Calendar className="mr-2 h-4 w-4" />}
                  {link.name === "Services" && <Search className="mr-2 h-4 w-4" />}
                  {link.name === "About Us" && <Info className="mr-2 h-4 w-4" />}
                  {link.name === "Contact" && <Phone className="mr-2 h-4 w-4" />}
                  {link.name}
                </div>
              </Link>
            ))}
            {user ? (
              <>
                <Link href={user.userType === "customer" ? "/dashboard/customer" : "/dashboard/business"}>
                  <div 
                    className="font-medium py-2 hover:text-primary flex items-center cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </div>
                </Link>
                <Link href="/dashboard/bookings">
                  <div 
                    className="font-medium py-2 hover:text-primary flex items-center cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Bookings
                  </div>
                </Link>
                <Link href="/dashboard/messages">
                  <div 
                    className="font-medium py-2 hover:text-primary flex items-center cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </div>
                </Link>
                <button
                  className="font-medium py-2 text-red-600 flex items-center"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth?register=true">
                  <Button 
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}