import { TimeEntry } from './time-entry';

export interface Day {
  id?: number;
  month?: number;
  name?: string;
  day?: number;
  dateString?: string;
  moment?: any;
  native?: Date;
  year?: number;
  time?: TimeEntry[];
  totalTime?: number;
  editable?: boolean;
}
