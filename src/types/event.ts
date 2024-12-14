export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  icsContent: string;
}

export interface DetectedEvent {
  title: string;
  datetime: string;
}