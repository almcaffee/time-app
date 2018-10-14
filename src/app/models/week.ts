import { Day } from './day';

export interface Week {
  id?: number;
  days?: Day[];
  monthName?: string;
  year?: number;
}
