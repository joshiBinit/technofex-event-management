export interface Event {
  id?: number;
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
