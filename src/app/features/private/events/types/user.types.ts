export const ADMIN = [
  'title',
  'category',
  'date',
  'time',
  'location',
  'tickets',
  'availableTickets',
  'price',
  'actions',
];

export const NORMAL_USER = [
  'title',
  'category',
  'date',
  'time',
  'location',
  'availableTickets',
  'price',
  'actions',
];

export type ROLE = 'admin' | 'user';

export const admin: ROLE = 'admin';
export const user: ROLE = 'user';
