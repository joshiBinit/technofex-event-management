import { Event } from '../../../../shared/model/event.model';
import { User } from '../../../../shared/model/user.model';
import { v4 as uuidv4 } from 'uuid';

export interface EventFormValue {
  title: string;
  category: string;
  description: string;
  location: string;
  totalTickets: number;
  price: number;
  schedule: {
    date: string;
    time: string;
  };
}

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

export function buildEventPayload(formValue: EventFormValue) {
  const {
    title,
    category,
    description,
    location,
    totalTickets,
    price,
    schedule,
  } = formValue;

  const dateObj = new Date(schedule.date);
  const formattedDate = dateObj.toISOString().split('T')[0];

  const timeObj = new Date(`1970-01-01T${schedule.time}`);
  let hours = timeObj.getHours();
  const minutes = timeObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`;

  return {
    id: uuidv4(),
    title,
    category,
    description,
    location,
    totalTickets,
    price,
    date: formattedDate,
    time: formattedTime,
    availableTickets: totalTickets,
  };
}
