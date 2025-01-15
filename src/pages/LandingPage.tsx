import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { Building2, Phone, Bell, Database } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <Logo />
          <Button 
            onClick={() => navigate('/auth/login')}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Your Secret to
          <span className="text-red-500"> Booking More Moves</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
          Powered by commercial real estate insights, MoveMagnet identifies businesses planning to move and delivers their contact details right to you.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/auth/login')}
          className="bg-red-500 hover:bg-red-600 text-white px-8"
        >
          Get Started
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Building2 className="h-8 w-8 text-red-500" />}
            title="Exclusive Market Access"
            description="Subscribe to your market and become the only one with insider access to detailed property information and exclusive info on upcoming business moves in your area"
          />
          <FeatureCard
            icon={<Phone className="h-8 w-8 text-red-500" />}
            title="Contact Info"
            description="Gain access to the most likely point of contact at each company. No more wasted time—MoveMagnet delivers the key people you need to reach"
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8 text-red-500" />}
            title="New Leads"
            description="Be notified in real time when high-priority leads are identified, ensuring you're always positioned to act first"
          />
          <FeatureCard
            icon={<Database className="h-8 w-8 text-red-500" />}
            title="Lead Tracking"
            description="Simplify lead management by tracking which leads have been added to your CRM and discarding irrelevant ones for a clutter-free experience"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="bg-zinc-800/50 rounded-2xl p-12 backdrop-blur">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book More Moves?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Join successful moving companies using MoveMagnet to find and secure their next customers.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth/login')}
            className="bg-red-500 hover:bg-red-600 text-white px-8"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6 backdrop-blur">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}