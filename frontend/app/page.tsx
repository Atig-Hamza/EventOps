import Link from "next/link";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { ArrowRight, Calendar, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel m-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-display font-bold text-xl tracking-tight">EventOps</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-sm animate-float">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">Now managing 10,000+ events</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight leading-tight">
            Event Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600">
              Reimagined
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600">
            Streamline your events with our glass-morphic, modern platform. 
            Powerful features wrapped in a beautiful, intuitive interface.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="bento-grid">
          <Card className="col-span-1 md:col-span-2 row-span-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-fuchsia-100/50 -z-10" />
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-slate-600">
                  Intelligent conflict detection and automated timeline management for seamless event planning.
                </p>
              </div>
              <div className="mt-8 rounded-lg bg-white/50 border border-white/60 p-4 transform group-hover:scale-105 transition-transform">
                <div className="flex gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-slate-200 rounded" />
                  <div className="h-2 w-1/2 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 -z-10" />
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Guest Management</h3>
            <p className="text-slate-600">Track RSVPs and preferences effortlessly.</p>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 -z-10" />
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Access</h3>
            <p className="text-slate-600">Role-based permissions and data encryption.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
