import { Event } from './event.model';
export interface User {
  username: string;
  password: string;
  role?: 'user' | 'admin';
  email?: string;
  bookings?: Event[];
}
