import * as BookingActions from '../event-booking/event-booking.action';
import { Event } from '../../../../../shared/model/event.model';

export function mapBookingResult(result: any, event: Event) {
  const failureMessages: Record<string, string> = {
    duplicate: `${event.title} is already booked ❌`,
    soldout: `${event.title} is sold out ❌`,
  };

  if (failureMessages[result]) {
    return BookingActions.bookEventFailure({ error: failureMessages[result] });
  }

  if (!result) {
    return BookingActions.bookEventFailure({
      error: `Failed to book ${event.title}`,
    });
  }

  return BookingActions.bookEventSuccess({ user: result });
}
