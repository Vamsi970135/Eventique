import { Check } from "lucide-react";

export default function AppPreview() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Download Our Mobile App</h2>
            <p className="text-neutral-500 mb-6">Get the EventEase app for a better experience. Browse, book and manage services on the go.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="text-green-500 mt-1 mr-3" />
                <span>Book services anytime, anywhere</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 mt-1 mr-3" />
                <span>Get real-time notifications for your bookings</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 mt-1 mr-3" />
                <span>Chat directly with service providers</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 mt-1 mr-3" />
                <span>Manage all your events in one place</span>
              </li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="inline-block">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png" alt="Download on the App Store" className="h-10" />
              </a>
              <a href="#" className="inline-block">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-10" />
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="bg-neutral-200 rounded-xl p-2 inline-block rotate-3 shadow-lg">
              <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="EventEase App Screenshot" className="rounded-lg max-w-full h-auto" />
            </div>
            <div className="bg-neutral-200 rounded-xl p-2 inline-block -rotate-3 shadow-lg absolute top-20 -right-4">
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="EventEase App Screenshot" className="rounded-lg max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
