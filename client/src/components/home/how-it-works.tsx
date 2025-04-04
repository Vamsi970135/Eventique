export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 bg-neutral-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">How EventEase Works</h2>
          <p className="text-neutral-500">Simple steps to find and book the perfect services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">Search Services</h3>
            <p className="text-neutral-500">Browse through our extensive list of service providers or search for specific requirements</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-2">Compare & Select</h3>
            <p className="text-neutral-500">Compare prices, reviews, and portfolios to find the perfect match for your event</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-2">Book & Manage</h3>
            <p className="text-neutral-500">Book services directly through our platform and manage all your event vendors in one place</p>
          </div>
        </div>
      </div>
    </section>
  );
}
