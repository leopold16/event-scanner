import React from 'react';
import Scanner from './components/Scanner';
import { EventsList } from './components/EventsList';
import { useEventManagement } from './hooks/useEventManagement';

export default function App() {
  const {
    events,
    isProcessing,
    error,
    handleEventsDetected,
    handleDownload,
    handleDelete,
    handleEdit
  } = useEventManagement();

  return (
    <div className="min-h-screen bg-sage-light p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl md:text-6xl italic tracking-tight text-sage-dark mb-2"
            style={{
              fontFamily: "Garamond, 'Garamond Premier Pro', 'ITC Garamond', Georgia, serif"
            }}
          >
            get planning
          </h1>
          <p className="text-sage-dark/80">
            Point your camera at text containing dates to automatically create calendar events
          </p>
        </div>

        <Scanner 
          onEventsDetected={handleEventsDetected}
          isProcessing={isProcessing}
        />

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <EventsList 
          events={events}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}