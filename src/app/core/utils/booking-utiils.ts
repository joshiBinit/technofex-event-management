import { Event } from '../../shared/model/event.model';
import { User } from '../../shared/model/user.model';

export function canBookEvent(
  user: User,
  event: Event
): 'duplicate' | 'soldout' | 'ok' {
  if (user.bookings?.some((e) => e.id === event.id)) return 'duplicate';
  if (event.availableTickets !== undefined && event.availableTickets <= 0)
    return 'soldout';
  return 'ok';
}

export function addEventToUser(user: User, event: Event): User {
  const updatedBookings = user.bookings ? [...user.bookings, event] : [event];
  return { ...user, bookings: updatedBookings };
}

export function removeEventFromUser(user: User, eventId: string): User {
  const updatedBookings = user.bookings?.filter((e) => e.id !== eventId) || [];
  return { ...user, bookings: updatedBookings };
}

export function decrementEventTickets(event: Event): Event {
  return {
    ...event,
    availableTickets: (event.availableTickets ?? event.totalTickets) - 1,
  };
}
