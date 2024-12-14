# Event Scanner

A modern web application that uses computer vision and AI to automatically detect and create calendar events from text in real-time. Built with React, TypeScript, and OpenAI's GPT-4 Vision.

[![Event Scanner Demo](https://img.youtube.com/vi/BcyyYC6SNsg/0.jpg)](https://www.youtube.com/watch?v=BcyyYC6SNsg)


## Features

- 📸 Real-time text scanning using device camera
- 🤖 AI-powered date and event detection
- 📅 Automatic calendar event creation
- 💾 Download events as .ics files
- ✏️ Edit event details
- 🗑️ Delete unwanted events
- 📱 Responsive design
- 🎨 Beautiful, minimal UI

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-4 Vision API
- **Date Parsing**: Chrono-node
- **Calendar Files**: ICS
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/         # React components
│   ├── Scanner/       # Camera and scanning functionality
│   └── EventsList/    # Event management UI
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── lib/              # Shared libraries and helpers
```

## Key Components

- `Scanner`: Handles real-time camera feed and text detection
- `EventsList`: Manages the list of detected events
- `useEventManagement`: Hook for event CRUD operations
- `useScannerState`: Hook for managing scanner state and processing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application and grant camera permissions
2. Point your camera at text containing dates or times
3. The app will automatically detect and create events
4. Edit or delete events as needed
5. Download events as .ics files to import into your calendar

## Features in Detail

### Real-time Scanning
- Continuous camera feed processing
- Visual feedback for detected dates
- Loading state during AI processing

### Event Management
- Edit event titles and times
- Delete unwanted events
- Download events in standard calendar format

### User Interface
- Clean, minimal design
- Responsive layout
- Clear visual feedback
- Intuitive controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Credits

- OpenAI for GPT-4 Vision API
- Icons by Lucide React
- UI design inspired by modern calendar applications
- This project was part of Lydia Chilton's Generative AI class at Columbia University. Thank you to an outstanding professor!
