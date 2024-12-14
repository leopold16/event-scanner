import emailjs from 'emailjs-com';
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

export async function sendEventByEmail(event: Event, userEmail: string) {
  try {
    const templateParams = {
      to_email: userEmail,
      title: event.title,
      date: format(event.start, 'EEEE, MMMM d, yyyy'),
      time: `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`,
      duration: `${Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))} minutes`,
      location: event.location || 'No location specified',
      description: event.description || 'No description provided',
      complexity: event.complexity,
      energy: event.energy
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_USER_ID
    );
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Propagate error to handle it in the App component
  }
}