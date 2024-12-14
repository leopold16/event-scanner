import { createEvent } from 'ics';

export function generateICS(
  event: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
  }
) {
  const icsEvent = {
    start: [
      event.start.getFullYear(),
      event.start.getMonth() + 1,
      event.start.getDate(),
      event.start.getHours(),
      event.start.getMinutes()
    ],
    end: [
      event.end.getFullYear(),
      event.end.getMonth() + 1,
      event.end.getDate(),
      event.end.getHours(),
      event.end.getMinutes()
    ],
    title: event.title,
    description: event.description,
    location: event.location,
    status: 'CONFIRMED',
    busyStatus: 'BUSY'
  };

  return new Promise<string>((resolve, reject) => {
    createEvent(icsEvent, (error: Error | undefined, value: string) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(value);
    });
  });
}