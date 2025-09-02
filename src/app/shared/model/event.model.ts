export interface Event {
  id?: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  totalTickets: number;
  availableTickets?: number;
  price: number;
}
