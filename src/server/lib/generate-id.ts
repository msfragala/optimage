import { customAlphabet } from 'nanoid/async';

export const generateId = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  12
);
