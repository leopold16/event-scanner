import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';

interface EventPreviewProps {
  event: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
  };
}

const EventPreview: React.FC<EventPreviewProps> = ({ event }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Preview</h2>
      
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-indigo-600 mt-1" />
        <div>
          <p className="font-medium text-gray-700">{event.title}</p>
          <p className="text-sm text-gray-500">
            {format(event.start, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-indigo-600 mt-1" />
        <div>
          <p className="text-sm text-gray-700">
            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
          </p>
          <p className="text-sm text-gray-500">
            Duration: {Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))} minutes
          </p>
        </div>
      </div>

      {event.location && (
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-indigo-600 mt-1" />
          <p className="text-sm text-gray-700">{event.location}</p>
        </div>
      )}

      {event.description && (
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-indigo-600 mt-1" />
          <p className="text-sm text-gray-700">{event.description}</p>
        </div>
      )}
    </div>
  );
};

export default EventPreview;