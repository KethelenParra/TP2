import { ResolveFn } from '@angular/router';

export const boxResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
