export interface Day {
  id?: number;
  month?: number;
  name?: string;
  day?: number;
  moment?: any;
  year?: number;
  time?: TimeEntry[];
  totaltime?: number;
}

export interface TimeEntry {
  timesheetid?: string;
  date?: Date;
  code?: string;
  hours?: number;
}
