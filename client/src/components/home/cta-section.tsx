import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Plan Your Next Event?</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Join thousands of customers who have successfully organized memorable events using our platform</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/services">
            <Button size="lg" className="px-8">Find Services</Button>
          </Link>
          <Link href="/auth?register=true&type=business">
            <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-secondary">
              List Your Business
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
