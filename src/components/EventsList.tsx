import React, { useState } from 'react';
import { Calendar, Download, Trash2, Edit2, X, Check } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  icsContent: string;
}

interface EventsListProps {
  events: Event[];
  onDownload: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onEdit: (eventId: string, updates: { title: string; start: Date; end: Date }) => void;
}

export function EventsList({ events, onDownload, onDelete, onEdit }: EventsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; start: Date; end: Date } | null>(null);

  if (events.length === 0) return null;

  const handleEditStart = (event: Event) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      start: event.start,
      end: event.end,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditSave = async (eventId: string) => {
    if (!editForm) return;
    
    await onEdit(eventId, editForm);
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-sage-dark">Created Events</h2>
        <span className="text-sm text-sage-dark/60">{events.length} events</span>
      </div>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-sage-accent/10 hover:border-sage-accent/20 transition-colors"
          >
            {editingId === event.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm?.title}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-sage-accent/20 rounded-lg focus:outline-none focus:border-sage-accent"
                />
                <div className="flex gap-3">
                  <input
                    type="datetime-local"
                    value={editForm?.start.toISOString().slice(0, 16)}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, start: new Date(e.target.value) } : null)}
                    className="flex-1 px-3 py-2 border border-sage-accent/20 rounded-lg focus:outline-none focus:border-sage-accent"
                  />
                  <input
                    type="datetime-local"
                    value={editForm?.end.toISOString().slice(0, 16)}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, end: new Date(e.target.value) } : null)}
                    className="flex-1 px-3 py-2 border border-sage-accent/20 rounded-lg focus:outline-none focus:border-sage-accent"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleEditCancel}
                    className="p-2 text-sage-dark/60 hover:text-sage-dark transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEditSave(event.id)}
                    className="p-2 text-sage-accent hover:text-sage-dark transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-sage-accent mt-1" />
                  <div>
                    <h3 className="font-medium text-sage-dark">{event.title}</h3>
                    <p className="text-sm text-sage-dark/60">
                      {event.start.toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditStart(event)}
                    className="p-2 text-sage-accent hover:text-sage-dark transition-colors"
                    title="Edit event"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDownload(event)}
                    className="p-2 text-sage-accent hover:text-sage-dark transition-colors"
                    title="Download .ics file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="p-2 text-sage-accent hover:text-sage-dark transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}