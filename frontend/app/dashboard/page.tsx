"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, Event, Reservation } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Calendar, MapPin, Ticket, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const isReserved = (eventId: string) => {
    return reservations.some(r => r.eventId === eventId && r.status !== 'CANCELED');
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navbar */}
      <nav className="glass-panel m-4 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-display font-bold text-xl tracking-tight">EventOps</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600 hidden sm:block">
            {user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* My Reservations Section */}
        {reservations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-violet-500" />
              My Tickets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map((res) => (
                <Card key={res.id} variant="glass" className="relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <div className="relative">
                    <div className="mb-4">
                      {/* @ts-expect-error - event is populated */}
                      <h3 className="text-lg font-bold">{res.event?.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        res.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    {/* @ts-expect-error */}
                     <div className="space-y-2 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {/* @ts-expect-error */}
                        {new Date(res.event?.dateTime).toLocaleDateString()} at {new Date(res.event?.dateTime).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                         {/* @ts-expect-error */}
                        {res.event?.location}
                      </div>
                    </div>
                    
                    {res.status !== 'CANCELED' && (
                       <Button variant="secondary" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleCancel(res.id)}>
                         Cancel Reservation
                       </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Available Events */}
        <section>
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-500" />
            Upcoming Events
          </h2>
          <div className="bento-grid">
            {events.map((event) => (
              <Card key={event.id} className="group relative flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {event.capacity} spots
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-violet-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(event.dateTime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  {isReserved(event.id) ? (
                    <Button disabled className="w-full bg-slate-100 text-slate-400 cursor-not-allowed shadow-none">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reserved
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleReserve(event.id)}
                    >
                      Reserve Spot
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
