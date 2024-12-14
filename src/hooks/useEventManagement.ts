import { useState } from 'react';
import { Event, DetectedEvent } from '../types/event';
import { parseInput } from '../utils/parser';
import { generateICS } from '../utils/icsGenerator';

export function useEventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleEventsDetected = async (detectedEvents: DetectedEvent[]) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const newEvents = await Promise.all(
        detectedEvents.map(async (detected) => {
          const parsedEvent = await parseInput(`${detected.title} on ${detected.datetime}`);
          const icsContent = await generateICS(parsedEvent);
          return {
            id: crypto.randomUUID(),
            ...parsedEvent,
            icsContent
          };
        })
      );

      setEvents(prev => {
        const existing = new Set(prev.map(e => `${e.title}-${e.start.getTime()}`));
        const filtered = newEvents.filter(e => !existing.has(`${e.title}-${e.start.getTime()}`));
        return [...prev, ...filtered];
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (event: Event) => {
    const filename = `${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
    const blob = new Blob([event.icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleEdit = async (eventId: string, updates: { title: string; start: Date; end: Date }) => {
    try {
      const icsContent = await generateICS(updates);
      setEvents(prev => prev.map(event => 
        event.id === eventId
          ? { ...event, ...updates, icsContent }
          : event
      ));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return {
    events,
    isProcessing,
    error,
    handleEventsDetected,
    handleDownload,
    handleDelete,
    handleEdit
  };
}