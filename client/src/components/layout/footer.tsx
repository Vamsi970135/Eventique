import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-800"> {/* Changed text color to black */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EventEase</h3>
            <p className="text-gray-600 mb-4">Your one-stop platform for finding and booking event services.</p> {/* Changed text color to dark gray */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-800 hover:text-gray-900">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-900">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><Link href="/services"><span className="text-gray-800 hover:text-gray-900">Find Services</span></Link></li>
              <li><a href="#how-it-works" className="text-gray-800 hover:text-gray-900">How It Works</a></li>
              <li><Link href="/contact"><span className="text-gray-800 hover:text-gray-900">Customer Support</span></Link></li>
              <li><Link href="/events"><span className="text-gray-800 hover:text-gray-900">Event Ideas</span></Link></li>
              <li><Link href="/services?category=weddings"><span className="text-gray-800 hover:text-gray-900">Wedding Planning</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2">
              <li><Link href="/auth?register=true&type=business"><span className="text-gray-800 hover:text-gray-900">List Your Business</span></Link></li>
              <li><Link href="/dashboard/business"><span className="text-gray-800 hover:text-gray-900">Business Dashboard</span></Link></li>
              <li><Link href="/success-stories"><span className="text-gray-800 hover:text-gray-900">Success Stories</span></Link></li>
              <li><Link href="/partnership"><span className="text-gray-800 hover:text-gray-900">Partnership Opportunities</span></Link></li>
              <li><Link href="/advertise"><span className="text-gray-800 hover:text-gray-900">Advertise With Us</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal & Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><span className="text-gray-800 hover:text-gray-900">About Us</span></Link></li>
              <li><Link href="/careers"><span className="text-gray-800 hover:text-gray-900">Careers</span></Link></li>
              <li><Link href="/privacy"><span className="text-gray-800 hover:text-gray-900">Privacy Policy</span></Link></li>
              <li><Link href="/terms"><span className="text-gray-800 hover:text-gray-900">Terms of Service</span></Link></li>
              <li><Link href="/contact"><span className="text-gray-800 hover:text-gray-900">Contact Us</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-800"> {/* Changed text color to black */}
          <p>&copy; {new Date().getFullYear()} Eventique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}