import * as chrono from 'chrono-node';
import { addHours } from 'date-fns';

export interface ParsedEvent {
  title: string;
  start: Date;
  end: Date;
  description: string;
}

export async function parseInput(input: string): Promise<ParsedEvent> {
  const parsed = chrono.parse(input, new Date(), { forwardDate: true });
  
  if (!parsed.length) {
    throw new Error('Could not understand the date and time in your input');
  }

  const parsedDate = parsed[0];
  if (!parsedDate.start) {
    throw new Error('Could not determine when the event starts');
  }

  const start = parsedDate.start.date();
  const end = parsedDate.end?.date() || addHours(start, 1);
  
  // Get the text before the date/time portion
  let title = input.substring(0, parsedDate.index).trim();
  
  // If no text before the date, check after the date
  if (!title) {
    title = input.substring(parsedDate.index + parsedDate.text.length).trim();
  }
  
  // If still no title, use a generic one
  if (!title) {
    title = 'Event from Image';
  }
  
  // Clean up the title
  title = title
    .replace(/^(on|at|for|in)\s+/i, '') // Remove leading prepositions
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  
  return {
    title,
    start,
    end,
    description: input
  };
}