import Link from "next/link";
import { Button } from "./components/Button";
import { ArrowRight, Calendar, Users, Shield, Zap, BarChart3, Clock, MapPin, CheckCircle, Star, Ticket, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[--background] overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel mt-4 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="font-semibold text-[17px] tracking-tight text-neutral-900">EventOps</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[14px] text-neutral-500 hover:text-neutral-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-[14px] text-neutral-500 hover:text-neutral-900 transition-colors">How it works</a>
              <a href="#testimonials" className="text-[14px] text-neutral-500 hover:text-neutral-900 transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-36 sm:pt-44 pb-8 px-4 sm:px-6 lg:px-8">
          {/* Subtle background grid */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #1d1d1f 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-200 h-150 bg-blue-200/20 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200/60 shadow-xs mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[13px] font-medium text-neutral-600">Trusted by 2,000+ event organizers worldwide</span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up text-[44px] sm:text-[56px] md:text-[72px] lg:text-[80px] font-extrabold text-neutral-900 tracking-[-0.035em] leading-[1.05] mb-6 text-balance">
                Plan events that{" "}
                <span className="gradient-text">people remember</span>
              </h1>

              {/* Subheadline */}
              <p className="animate-fade-in-up animation-delay-100 text-[17px] sm:text-[19px] text-neutral-500 leading-[1.7] max-w-2xl mx-auto mb-10">
                From intimate gatherings to large-scale conferences — EventOps gives you the tools
                to create, manage, and deliver flawless events with zero friction.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up animation-delay-200 flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto group shadow-lg shadow-neutral-900/10">
                    Start for free
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    View live demo
                  </Button>
                </Link>
              </div>

              {/* Trust line */}
              <p className="animate-fade-in-up animation-delay-300 text-[13px] text-neutral-400">
                Free plan available · No credit card required · Setup in 2 minutes
              </p>
            </div>

            {/* ── Hero Visual (Dashboard Mockup) ── */}
            <div className="animate-fade-in-up animation-delay-400 mt-16 sm:mt-20 max-w-6xl mx-auto relative">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-linear-to-b from-blue-100/50 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative rounded-2xl border border-neutral-200/80 bg-white shadow-2xl shadow-neutral-900/6 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-100 bg-neutral-50/80">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 text-[12px] text-neutral-400 font-medium bg-neutral-100 rounded-lg px-4 py-1.5">
                      <svg className="w-3 h-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      app.eventops.com/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 sm:p-8">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-[13px] text-neutral-400 font-medium mb-1">Dashboard</div>
                      <div className="text-[20px] font-bold text-neutral-900 tracking-tight">Good morning, Sarah</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-[13px] font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> New Event
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Active Events", value: "24", change: "+3", icon: Calendar, color: "text-blue-600 bg-blue-50" },
                      { label: "Total Guests", value: "1,847", change: "+126", icon: Users, color: "text-violet-600 bg-violet-50" },
                      { label: "Reservations", value: "892", change: "+48", icon: Ticket, color: "text-emerald-600 bg-emerald-50" },
                      { label: "Revenue", value: "$34.2k", change: "+12%", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-xl border border-neutral-100 p-4 hover:border-neutral-200 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 tracking-tight">{stat.value}</div>
                        <div className="text-[12px] text-neutral-400 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom section */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Chart */}
                    <div className="md:col-span-3 rounded-xl border border-neutral-100 p-5">
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-[14px] font-semibold text-neutral-900">Registrations</div>
                        <div className="flex gap-1">
                          {["7d", "30d", "90d"].map((t) => (
                            <button key={t} className={`text-[11px] font-medium px-2.5 py-1 rounded-md ${t === "30d" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:bg-neutral-50"}`}>{t}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-end gap-1.5 h-30">
                        {[35, 52, 41, 68, 48, 75, 60, 82, 55, 88, 64, 92, 70, 85, 78, 95].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm transition-all duration-300"
                            style={{
                              height: `${h}%`,
                              background: i >= 13 ? '#0071e3' : i >= 10 ? '#3b82f6' : '#e5e7eb',
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-3 text-[10px] text-neutral-300">
                        <span>Jan 15</span><span>Jan 22</span><span>Jan 29</span><span>Feb 5</span>
                      </div>
                    </div>

                    {/* Upcoming events */}
                    <div className="md:col-span-2 rounded-xl border border-neutral-100 p-5">
                      <div className="text-[14px] font-semibold text-neutral-900 mb-4">Upcoming</div>
                      <div className="space-y-3">
                        {[
                          { title: "Design Summit 2026", date: "Feb 14", guests: 248, color: "bg-blue-500" },
                          { title: "Product Launch", date: "Feb 18", guests: 120, color: "bg-violet-500" },
                          { title: "Team Retreat", date: "Feb 22", guests: 45, color: "bg-emerald-500" },
                        ].map((event, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors -mx-1 px-3">
                            <div className={`w-1 h-10 rounded-full ${event.color}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-neutral-900 truncate">{event.title}</div>
                              <div className="text-[12px] text-neutral-400 flex items-center gap-2">
                                <span>{event.date}</span>
                                <span>·</span>
                                <span>{event.guests} guests</span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge cards */}
              <div className="hidden lg:block absolute -left-10 top-1/3 animate-float">
                <div className="bg-white rounded-xl border border-neutral-200/60 shadow-lg p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-neutral-900">Reservation Confirmed</div>
                    <div className="text-[11px] text-neutral-400">Just now</div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block absolute -right-6 top-1/2 animate-float animation-delay-200">
                <div className="bg-white rounded-xl border border-neutral-200/60 shadow-lg p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-neutral-900">+48 guests today</div>
                    <div className="text-[11px] text-emerald-500 font-medium">↑ 18% from avg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Logos / Social Proof ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-[13px] font-medium text-neutral-400 tracking-wide uppercase mb-8">Trusted by teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
              {["Acme Corp", "Globex", "Soylent", "Initech", "Hooli", "Piedmont"].map((name) => (
                <div key={name} className="text-[18px] font-bold text-neutral-900 tracking-tight">{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[12px] font-semibold text-blue-600 uppercase tracking-widest mb-4">Features</div>
              <h2 className="text-3xl sm:text-[40px] font-bold text-neutral-900 tracking-tight leading-[1.15] mb-4 text-balance">
                Everything you need to run world-class events
              </h2>
              <p className="text-neutral-500 text-[17px] leading-relaxed">
                Powerful, flexible tools designed to simplify every stage of event management.
              </p>
            </div>

            {/* Feature bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Feature 1 – Hero card (wide) */}
              <div className="md:col-span-4 group rounded-2xl border border-neutral-200/60 bg-white p-8 sm:p-10 hover:shadow-lg hover:border-neutral-200 transition-all duration-300 overflow-hidden relative">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-[22px] font-bold mb-3 text-neutral-900 tracking-tight">Smart scheduling & planning</h3>
                  <p className="text-neutral-500 text-[15px] leading-relaxed max-w-xl mb-8">
                    AI-powered conflict detection, automated timeline management, and intelligent venue matching.
                    Plan across teams and time zones with zero effort.
                  </p>
                </div>
                {/* Mini dashboard visual */}
                <div className="relative z-10 rounded-xl bg-neutral-50 border border-neutral-100 p-5 max-w-md group-hover:border-neutral-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] font-semibold text-neutral-700">Schedule</div>
                    <div className="text-[11px] text-neutral-400 font-medium bg-white px-2 py-0.5 rounded-md border border-neutral-100">This week</div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { time: "09:00", title: "Keynote Rehearsal", color: "bg-blue-500" },
                      { time: "11:30", title: "Vendor Check-in", color: "bg-violet-500" },
                      { time: "14:00", title: "AV Sound Check", color: "bg-emerald-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-neutral-100">
                        <div className={`w-1 h-8 rounded-full ${item.color}`} />
                        <div>
                          <div className="text-[12px] text-neutral-400">{item.time}</div>
                          <div className="text-[13px] font-medium text-neutral-800">{item.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 2 – Tall right */}
              <div className="md:col-span-2 group rounded-2xl border border-neutral-200/60 bg-white p-8 hover:shadow-lg hover:border-neutral-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold mb-2 text-neutral-900 tracking-tight">Guest management</h3>
                <p className="text-neutral-500 text-[14px] leading-relaxed mb-6">
                  Track RSVPs, manage waitlists, and handle seating — all in one place.
                </p>
                {/* Mini avatar stack */}
                <div className="flex items-center">
                  <div className="flex -space-x-2.5">
                    {["#0071e3", "#5856d6", "#af52de", "#ff9f0a", "#34c759"].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: c, zIndex: 5 - i }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 text-[12px] font-medium text-neutral-400">+243 more</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-2 group rounded-2xl border border-neutral-200/60 bg-white p-8 hover:shadow-lg hover:border-neutral-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold mb-2 text-neutral-900 tracking-tight">Role-based access</h3>
                <p className="text-neutral-500 text-[14px] leading-relaxed">
                  Fine-grained permissions for admins, organizers, and participants. Enterprise-grade security built in.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-2 group rounded-2xl border border-neutral-200/60 bg-white p-8 hover:shadow-lg hover:border-neutral-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold mb-2 text-neutral-900 tracking-tight">Real-time updates</h3>
                <p className="text-neutral-500 text-[14px] leading-relaxed">
                  Instant notifications, live attendee counts, and real-time status dashboards for every event.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="md:col-span-2 group rounded-2xl border border-neutral-200/60 bg-white p-8 hover:shadow-lg hover:border-neutral-200 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold mb-2 text-neutral-900 tracking-tight">Deep analytics</h3>
                <p className="text-neutral-500 text-[14px] leading-relaxed">
                  Detailed insights into attendance, engagement rates, and revenue performance at a glance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-neutral-50/60 border-y border-neutral-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-[12px] font-semibold text-emerald-600 uppercase tracking-widest mb-4">How it works</div>
              <h2 className="text-3xl sm:text-[40px] font-bold text-neutral-900 tracking-tight leading-[1.15] mb-4">
                From idea to live event in minutes
              </h2>
              <p className="text-neutral-500 text-[17px] leading-relaxed">
                Three simple steps to get your event up and running.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {[
                {
                  step: "01",
                  title: "Create your event",
                  description: "Set up your event details — title, date, location, and capacity. It takes less than 60 seconds.",
                  icon: Calendar,
                },
                {
                  step: "02",
                  title: "Invite & manage guests",
                  description: "Share your event link, manage RSVPs in real-time, and track who's attending at a glance.",
                  icon: Users,
                },
                {
                  step: "03",
                  title: "Launch & monitor",
                  description: "Publish your event and watch the magic happen. Real-time analytics keep you informed every step.",
                  icon: BarChart3,
                },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="rounded-2xl border border-neutral-200/60 bg-white p-8 hover:shadow-lg hover:border-neutral-200 transition-all duration-300 h-full">
                    <div className="text-[48px] font-extrabold text-neutral-100 tracking-tighter leading-none mb-6 group-hover:text-blue-100 transition-colors duration-300">
                      {item.step}
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 mb-5 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[18px] font-bold mb-2 text-neutral-900 tracking-tight">{item.title}</h3>
                    <p className="text-neutral-500 text-[14px] leading-relaxed">{item.description}</p>
                  </div>
                  {/* Connector arrow (hidden on mobile, between cards) */}
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-neutral-200 items-center justify-center shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-[12px] font-semibold text-amber-600 uppercase tracking-widest mb-4">Testimonials</div>
              <h2 className="text-3xl sm:text-[40px] font-bold text-neutral-900 tracking-tight leading-[1.15] mb-4">
                Loved by event organizers
              </h2>
              <p className="text-neutral-500 text-[17px] leading-relaxed">
                See what our users have to say about their experience with EventOps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: "Sarah Chen",
                  role: "Event Director, TechSummit",
                  quote: "EventOps transformed how we run our annual conference. The dashboard alone saved us 20 hours of manual work per event.",
                  rating: 5,
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Community Manager, StartupHub",
                  quote: "The guest management features are incredible. We went from spreadsheets to a fully automated system in a single afternoon.",
                  rating: 5,
                },
                {
                  name: "Emily Nakamura",
                  role: "Operations Lead, CreativeCo",
                  quote: "Clean, intuitive, and powerful. EventOps is exactly what we needed. The real-time analytics give us insights we never had before.",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200/60 bg-white p-8 hover:shadow-lg hover:border-neutral-200 transition-all duration-300">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-700 text-[15px] leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-[13px] font-bold">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-[12px] text-neutral-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-[28px] bg-neutral-900 p-12 sm:p-20 relative overflow-hidden">
              {/* Ambient glows */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/12 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px]" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-[44px] font-bold text-white tracking-tight leading-[1.1] mb-5">
                  Ready to create your<br />next great event?
                </h2>
                <p className="text-white/50 text-[17px] leading-relaxed mb-10 max-w-lg mx-auto">
                  Join thousands of organizers who use EventOps to deliver unforgettable experiences. Start free today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-xl shadow-black/20 w-full sm:w-auto group">
                      Get started free
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 w-full sm:w-auto">
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">E</div>
                  <span className="font-semibold text-[17px] tracking-tight text-neutral-900">EventOps</span>
                </div>
                <p className="text-[14px] text-neutral-400 leading-relaxed max-w-xs">
                  The modern platform for creating, managing, and delivering exceptional events.
                </p>
              </div>
              {/* Links */}
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "API"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
              ].map((col) => (
                <div key={col.title}>
                  <div className="text-[13px] font-semibold text-neutral-900 mb-4">{col.title}</div>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <span className="text-[14px] text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors">{link}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[13px] text-neutral-400">© 2026 EventOps. All rights reserved.</span>
              <div className="flex items-center gap-4">
                {/* Social icons (placeholder) */}
                {["X", "GH", "LI"].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[11px] font-bold text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
