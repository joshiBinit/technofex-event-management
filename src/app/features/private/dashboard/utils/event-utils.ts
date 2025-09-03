// src/app/features/private/dashboard/utils/event-utils.ts
import { Event } from '../../../../shared/model/event.model';
import { User } from '../../../../shared/model/user.model';

/**
 * Compute total tickets booked for each event based on all users
 */
export function computeEventsWithBookings(
  events: Event[],
  users: User[]
): (Event & { ticketsBooked: number })[] {
  return events.map((event) => {
    const ticketsBooked = users.reduce((count, user) => {
      return (
        count + (user.bookings?.filter((b) => b.id === event.id).length || 0)
      );
    }, 0);

    return {
      ...event,
      ticketsBooked,
    };
  });
}
