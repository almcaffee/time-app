import { Day } from './day';

export interface Month {
  id?: number;
  name?: string;
  days?: Day[];
  year?: number;
}
