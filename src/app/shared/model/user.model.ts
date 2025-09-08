import { ROLE } from '../../features/private/events/types/user.types';
import { Event } from './event.model';
export interface User {
  username: string;
  password: string;
  role?: ROLE;
  email?: string;
  bookings?: Event[];
}
