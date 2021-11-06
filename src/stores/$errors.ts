import { immutable } from 'ssws';

const store = immutable<Record<string, string>>({});

export const $errors = {
  subscribe: store.subscribe,
  setError(name: string, message: string) {
    store.update(s => {
      s[name] = message;
    });
  },
  removeError(name: string) {
    store.update(s => {
      delete s[name];
    });
  },
};
