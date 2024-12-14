import { gapi } from 'gapi-script';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export async function initializeGoogleApi() {
  await gapi.client.init({
    discoveryDocs: [DISCOVERY_DOC],
    scope: SCOPES,
  });
}

export async function addToGoogleCalendar(event: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}) {
  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: event.title,
        location: event.location,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    });

    return response.result;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
}