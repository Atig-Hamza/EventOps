"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, Event, Reservation } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Calendar, MapPin, Ticket, Clock, CheckCircle, LogOut, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Wait for auth

    const fetchData = async () => {
      try {
        const [eventsRes, reservationsRes] = await Promise.all([
          api.get("/events"),
          api.get("/reservations/my"),
        ]);
        setEvents(eventsRes.data);
        setReservations(reservationsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleReserve = async (eventId: string) => {
    try {
      await api.post("/reservations", { eventId });
      // Refresh reservations
      const res = await api.get("/reservations/my");
      setReservations(res.data);
      alert("Reservation created successfully!");
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      alert(error.response?.data?.message || "Failed to reserve");
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      await api.patch(`/reservations/${reservationId}/cancel`);
      // Refresh reservations
      const res = await api.get("/reservations/my");
      setReservations(res.data);
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      alert(error.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--background]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
          <p className="text-[14px] text-neutral-400">Loading your events...</p>
        </div>
      </div>
    );
  }

  const isReserved = (eventId: string) => {
    return reservations.some(r => r.eventId === eventId && r.status !== 'CANCELED');
  };

  const activeReservations = reservations.filter(r => r.status !== 'CANCELED');

  return (
    <div className="min-h-screen bg-[--background] pb-16">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[--surface-frosted] backdrop-blur-xl border-b border-[--border]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="font-semibold text-[17px] tracking-tight text-neutral-900">EventOps</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100">
                <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-[13px] font-medium text-neutral-600 max-w-45 truncate">
                  {user?.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Hero greeting */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
          </h1>
          <p className="text-neutral-500 text-[16px]">
            Here&apos;s what&apos;s happening with your events.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Available events</div>
            <div className="text-2xl font-bold text-neutral-900">{events.length}</div>
          </div>
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">My reservations</div>
            <div className="text-2xl font-bold text-neutral-900">{activeReservations.length}</div>
          </div>
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Confirmed</div>
            <div className="text-2xl font-bold text-emerald-600">{reservations.filter(r => r.status === 'CONFIRMED').length}</div>
          </div>
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-500">{reservations.filter(r => r.status === 'PENDING').length}</div>
          </div>
        </div>

        {/* My Reservations Section */}
        {activeReservations.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                  <Ticket className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">My tickets</h2>
              </div>
              <span className="text-[13px] text-neutral-400 font-medium">{activeReservations.length} active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations.map((res, i) => (
                <div
                  key={res.id}
                  className="animate-fade-in group rounded-xl border border-[--border] bg-white p-5 hover:shadow-[--shadow-md] hover:border-[--border-strong] transition-all duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-[16px] font-semibold text-neutral-900 leading-tight pr-3">
                      {res.event?.title}
                    </h3>
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                      res.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      res.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      res.status === 'CANCELED' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-neutral-50 text-neutral-600 border border-neutral-100'
                    }`}>
                      {res.status === 'CONFIRMED' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />}
                      {res.status === 'PENDING' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />}
                      {res.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2.5 text-[14px] text-neutral-500 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{new Date(res.event?.dateTime || '').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="text-neutral-300">·</span>
                      <span>{new Date(res.event?.dateTime || '').toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{res.event?.location}</span>
                    </div>
                  </div>
                  
                  {res.status !== 'CANCELED' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => handleCancel(res.id)}
                    >
                      Cancel reservation
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Available Events */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">Upcoming events</h2>
            </div>
            <span className="text-[13px] text-neutral-400 font-medium">{events.length} available</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, i) => (
              <div
                key={event.id}
                className="animate-fade-in group rounded-xl border border-[--border] bg-white flex flex-col overflow-hidden hover:shadow-[--shadow-md] hover:border-[--border-strong] transition-all duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Color bar */}
                <div className="h-1 bg-linear-to-r from-neutral-900 via-neutral-700 to-neutral-400 opacity-80" />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all duration-300">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-[12px] font-semibold text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">
                      {event.capacity} spots
                    </span>
                  </div>
                  
                  <h3 className="text-[17px] font-semibold mb-1.5 text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-neutral-400 text-[14px] mb-5 line-clamp-2 leading-relaxed flex-1">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-[13px] text-neutral-500 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {new Date(event.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {event.location}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {isReserved(event.id) ? (
                      <div className="flex items-center justify-center gap-2 h-10 rounded-full bg-neutral-50 border border-neutral-100 text-[14px] font-medium text-neutral-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Reserved
                      </div>
                    ) : (
                      <Button 
                        className="w-full group/btn"
                        onClick={() => handleReserve(event.id)}
                      >
                        Reserve spot
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-[17px] font-semibold text-neutral-900 mb-1">No events yet</h3>
              <p className="text-neutral-400 text-[15px]">Check back soon for upcoming events.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
