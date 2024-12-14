import React from 'react';
import { Trash2, Brain, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  complexity: number;
  energy: number;
  image?: string;
}

interface EventListProps {
  events: Event[];
  onRemoveEvent: (index: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onRemoveEvent }) => {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const duration = Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60));

        return (
          <div key={index} className="relative border border-sage-accent/20 rounded-lg p-6 bg-sage-light/50">
            <button
              onClick={() => onRemoveEvent(index)}
              className="absolute top-4 right-4 text-sage-accent hover:text-sage-dark transition-colors"
              title="Remove event"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex gap-6">
              {event.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-sage-dark mb-2">{event.title}</h3>
                
                <div className="text-sm text-sage-dark/70 mb-4">
                  {format(event.start, 'EEEE, MMMM d, yyyy')}
                  <br />
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sage-accent">
                      <Brain className="w-4 h-4" />
                      <span className="text-xs">Complexity</span>
                    </div>
                    <div className="text-lg font-semibold text-sage-dark">
                      {event.complexity}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sage-accent">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Duration</span>
                    </div>
                    <div className="text-lg font-semibold text-sage-dark">
                      {duration}m
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sage-accent">
                      <Activity className="w-4 h-4" />
                      <span className="text-xs">Energy</span>
                    </div>
                    <div className="text-lg font-semibold text-sage-dark">
                      {event.energy}
                    </div>
                  </div>
                </div>

                {event.location && (
                  <div className="mt-4 text-sm text-sage-dark/70">
                    📍 {event.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventList;