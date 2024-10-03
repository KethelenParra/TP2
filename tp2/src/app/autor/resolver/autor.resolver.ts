import { ResolveFn } from '@angular/router';

export const autorResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
