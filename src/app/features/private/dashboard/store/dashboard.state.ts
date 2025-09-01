export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  bookings: number;
}

export interface EventState {
  events: Event[];
  users: number; // total users
}

export const initialEventState: EventState = {
  events: [
    {
      id: 1,
      name: 'Music Concert',
      date: '2025-09-15',
      location: 'New York',
      bookings: 120,
    },
    {
      id: 2,
      name: 'Tech Conference',
      date: '2025-10-05',
      location: 'San Francisco',
      bookings: 300,
    },
    {
      id: 3,
      name: 'Art Exhibition',
      date: '2025-10-20',
      location: 'Los Angeles',
      bookings: 80,
    },
  ],
  users: 250,
};

// user.state.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserState {
  users: User[];
}
