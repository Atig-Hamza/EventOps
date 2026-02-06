"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, Event, Reservation } from "@/lib/api";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import { Check, X, Plus, LayoutDashboard, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'reservations'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Create Event Form
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
      fetchEvents(); // Update counts
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pb-12 bg-slate-50/50">
      {/* Navbar */}
      <nav className="glass-panel m-4 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'events' 
                ? 'bg-white text-violet-600 shadow-lg shadow-violet-100 ring-1 ring-violet-100' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Events Management
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'reservations' 
                ? 'bg-white text-violet-600 shadow-lg shadow-violet-100 ring-1 ring-violet-100' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Users className="w-5 h-5" />
            Reservations
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-display">All Events</h2>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" /> Create Event
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map(event => (
                <Card key={event.id} variant="solid" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                        event.status === 'DRAFT' ? 'bg-slate-100 text-slate-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 flex gap-4">
                      <span>{new Date(event.dateTime).toLocaleString()}</span>
                      <span>{event.location}</span>
                      <span>{event.reservedCount} / {event.capacity} reserved</span>
                    </div>
                  </div>
                  
                  {event.status === 'DRAFT' && (
                    <Button size="sm" onClick={() => handlePublish(event.id)}>
                      Publish Event
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Reservation Requests</h2>
            <div className="grid gap-4">
              {reservations.map(res => (
                <Card key={res.id} variant="solid" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-200">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">
                      {res.user?.email}
                    </div>
                    <div className="text-sm text-slate-500">
                      Requested for: <span className="font-medium text-slate-700">{res.event?.title}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(res.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        res.status === 'REFUSED' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                      {res.status}
                    </span>
                    
                    {res.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleReservationStatus(res.id, 'CONFIRMED')}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleReservationStatus(res.id, 'REFUSED')}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white shadow-2xl animate-float" variant="solid">
            <h3 className="text-xl font-bold mb-4">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <Input
                label="Event Title"
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
              <Input
                 label="Description"
                 value={newEvent.description}
                 onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                 required
              />
              <Input
                label="Date & Time"
                type="datetime-local"
                value={newEvent.dateTime}
                onChange={e => setNewEvent({...newEvent, dateTime: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Location"
                  value={newEvent.location}
                  onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                  required
                />
                <Input
                  label="Capacity"
                  type="number"
                  value={newEvent.capacity}
                  onChange={e => setNewEvent({...newEvent, capacity: Number(e.target.value)})}
                  required
                  min={1}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Draft
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
