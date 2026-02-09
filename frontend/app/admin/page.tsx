"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, Event, Reservation } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import { Check, X, Plus, LayoutDashboard, Users, Calendar, MapPin, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'reservations'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: '',
    capacity: 0,
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/admin");
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations/admin");
      setReservations(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const load = async () => {
      await Promise.all([fetchEvents(), fetchReservations()]);
      setLoading(false);
    };
    load();
  }, [user, router]);

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/events", newEvent);
      setShowCreateModal(false);
      setNewEvent({ title: '', description: '', dateTime: '', location: '', capacity: 0 });
      fetchEvents();
    } catch (err) {
      const error = err as { response?: { data?: { message: string } } };
      alert(error.response?.data?.message || "Failed to create event");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/events/${id}`, { status: 'PUBLISHED' });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to publish");
    }
  };

  const handleReservationStatus = async (id: string, status: 'CONFIRMED' | 'REFUSED') => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      fetchReservations();
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--background]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
          <p className="text-[14px] text-neutral-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const pendingCount = reservations.filter(r => r.status === 'PENDING').length;
  const draftCount = events.filter(e => e.status === 'DRAFT').length;

  return (
    <div className="min-h-screen bg-[--background] pb-16">

      <nav className="sticky top-0 z-50 bg-[--surface-frosted] backdrop-blur-xl border-b border-[--border]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[17px] tracking-tight text-neutral-900">EventOps</span>
                <span className="text-[12px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Admin</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Total events</div>
            <div className="text-2xl font-bold text-neutral-900">{events.length}</div>
          </div>
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Drafts</div>
            <div className="text-2xl font-bold text-amber-500">{draftCount}</div>
          </div>
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Reservations</div>
            <div className="text-2xl font-bold text-neutral-900">{reservations.length}</div>
          </div>
          <div className="rounded-xl border border-[--border] bg-white p-5">
            <div className="text-[13px] font-medium text-neutral-400 mb-1">Pending review</div>
            <div className="text-2xl font-bold text-accent">{pendingCount}</div>
          </div>
        </div>


        <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit mb-8">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 cursor-pointer ${activeTab === 'events'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 cursor-pointer ${activeTab === 'reservations'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            <Users className="w-4 h-4" />
            Reservations
            {pendingCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">All events</h2>
              <Button onClick={() => setShowCreateModal(true)} size="sm">
                <Plus className="w-4 h-4 mr-1.5" /> New event
              </Button>
            </div>


            <div className="rounded-xl border border-[--border] bg-white overflow-hidden">

              <div className="hidden sm:grid grid-cols-[1fr_120px_140px_140px_120px] gap-4 px-5 py-3 border-b border-[--border] bg-neutral-50/50 text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
                <span>Event</span>
                <span>Status</span>
                <span>Date</span>
                <span>Capacity</span>
                <span>Action</span>
              </div>

              {events.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-[15px] font-medium text-neutral-900 mb-1">No events yet</p>
                  <p className="text-[14px] text-neutral-400">Create your first event to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-[--border]">
                  {events.map((event, i) => (
                    <div
                      key={event.id}
                      className="animate-fade-in grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_140px_120px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-neutral-50/50 transition-colors duration-150"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div>
                        <h3 className="font-semibold text-[15px] text-neutral-900">{event.title}</h3>
                        <p className="text-[13px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${event.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            event.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'PUBLISHED' ? 'bg-emerald-500' :
                              event.status === 'DRAFT' ? 'bg-amber-500' :
                                'bg-red-500'
                            }`} />
                          {event.status}
                        </span>
                      </div>
                      <div className="text-[14px] text-neutral-500">
                        {new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[14px] text-neutral-500">
                        <span className="font-medium text-neutral-700">{event.reservedCount || 0}</span>
                        <span className="text-neutral-300"> / </span>
                        <span>{event.capacity}</span>
                      </div>
                      <div>
                        {event.status === 'DRAFT' && (
                          <Button size="sm" onClick={() => handlePublish(event.id)}>
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">Reservation requests</h2>

            <div className="rounded-xl border border-[--border] bg-white overflow-hidden">

              <div className="hidden sm:grid grid-cols-[1fr_1fr_140px_100px_100px] gap-4 px-5 py-3 border-b border-[--border] bg-neutral-50/50 text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
                <span>Guest</span>
                <span>Event</span>
                <span>Requested</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {reservations.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-[15px] font-medium text-neutral-900 mb-1">No reservations yet</p>
                  <p className="text-[14px] text-neutral-400">Reservations will appear here once guests sign up.</p>
                </div>
              ) : (
                <div className="divide-y divide-[--border]">
                  {reservations.map((res, i) => (
                    <div
                      key={res.id}
                      className="animate-fade-in grid grid-cols-1 sm:grid-cols-[1fr_1fr_140px_100px_100px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-neutral-50/50 transition-colors duration-150"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                          <span className="text-[12px] font-bold text-neutral-600">{res.user?.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-[14px] font-medium text-neutral-900 truncate">{res.user?.email}</span>
                      </div>
                      <div className="text-[14px] text-neutral-600 font-medium truncate">
                        {res.event?.title}
                      </div>
                      <div className="text-[13px] text-neutral-400">
                        {new Date(res.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${res.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            res.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              res.status === 'REFUSED' ? 'bg-red-50 text-red-600 border border-red-100' :
                                'bg-neutral-50 text-neutral-600 border border-neutral-100'
                          }`}>
                          {res.status}
                        </span>
                      </div>
                      <div>
                        {res.status === 'PENDING' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleReservationStatus(res.id, 'CONFIRMED')}
                              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReservationStatus(res.id, 'REFUSED')}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>


      {showCreateModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowCreateModal(false)}
          />


          <div className="relative w-full max-w-lg animate-scale-in">
            <div className="bg-white rounded-2xl shadow-xl border border-[--border] overflow-hidden">

              <div className="px-6 py-5 border-b border-[--border]">
                <h3 className="text-[18px] font-bold text-neutral-900 tracking-tight">Create new event</h3>
                <p className="text-[14px] text-neutral-400 mt-0.5">Fill in the details for your event</p>
              </div>


              <form onSubmit={handleCreateEvent} className="p-6 space-y-5">
                <Input
                  label="Event title"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Annual Tech Conference"
                  required
                />
                <Input
                  label="Description"
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe your event..."
                  required
                />
                <Input
                  label="Date & time"
                  type="datetime-local"
                  value={newEvent.dateTime}
                  onChange={e => setNewEvent({ ...newEvent, dateTime: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Location"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="e.g. Main Hall"
                    required
                  />
                  <Input
                    label="Capacity"
                    type="number"
                    value={newEvent.capacity}
                    onChange={e => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    required
                    min={1}
                  />
                </div>


                <div className="flex justify-end gap-2.5 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create event
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
