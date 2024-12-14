import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ExtractedEvent {
  title: string;
  datetime: string;
}

export async function extractDateFromImage(imageFile: File): Promise<ExtractedEvent[]> {
  try {
    const base64Image = await fileToBase64(imageFile);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a precise date and event extractor. Your task is to identify dates, times, and associated event descriptions from images. Only extract events that have clear dates or times associated with them. A possible date would also be tomorrow or today, where you should assume the current date and estimate a time. The word 'on' should never be part of your response. If no dates or times are found, return an empty response. Format each event as 'Event: [event description] | DateTime: [date and time]'. Separate multiple events with '|||'."
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Extract any events with dates/times from this image. Only return events that have clear dates/times associated with them. Do not use the word 'on' in your output for the title." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const result = response.choices[0]?.message?.content?.trim();
    
    if (!result || result === 'null' || !result.includes('Event:')) {
      return [];
    }

    // Split the response into individual events
    const events = result.split('|||').map(eventStr => {
      const titleMatch = eventStr.match(/Event:\s*([^|]+)/i);
      const dateTimeMatch = eventStr.match(/DateTime:\s*(.+)$/i);

      if (!titleMatch || !dateTimeMatch) return null;

      return {
        title: titleMatch[1].trim(),
        datetime: dateTimeMatch[1].trim()
      };
    }).filter((event): event is ExtractedEvent => event !== null);

    return events;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Unable to process the image. Please try again.');
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });
}