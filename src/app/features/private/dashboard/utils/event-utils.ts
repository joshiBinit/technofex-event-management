import { Event } from '../../../../shared/model/event.model';
import { User } from '../../../../shared/model/user.model';

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
