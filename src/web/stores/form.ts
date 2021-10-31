import { immutable } from 'ssws';

interface Fields {
  files: File[];
  sizes: string[];
}

type FieldName = keyof Fields;
type SubmissionState = 'idle' | 'pending' | 'success' | 'error';

export interface FormStore {
  errors: Record<FieldName, string>;
  values: Fields;
  submissionState: SubmissionState;
}

const initialState = (): FormStore => ({
  errors: {
    files: '',
    sizes: '',
  },
  values: {
    files: [],
    sizes: ['200', '400', '800', '1200'],
  },
  submissionState: 'idle',
});

const store = immutable<FormStore>(initialState());

export const $form = {
  subscribe: store.subscribe,
  setError(name: FieldName, error: string) {
    store.update(state => {
      state.errors[name] = error;
    });
  },
  addFiles(files: File[]) {
    store.update(state => {
      state.values.files.push(...files);
    });
  },
  removeFile(file: File) {
    store.update(state => {
      state.values.files = state.values.files.filter(n => n !== file);
    });
  },
  addSize(size: string) {
    store.update(state => {
      state.values.sizes.push(size);
    });
  },
  removeSize(size: string) {
    store.update(state => {
      state.values.sizes = state.values.sizes.filter(n => n !== size);
    });
  },
  setSubmissionState(state: SubmissionState) {
    store.update(s => {
      s.submissionState = state;
    });
  },
  reset() {
    store.update(() => initialState());
  },
};
