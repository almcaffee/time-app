export interface Day {
  id?: number;
  month?: number;
  name?: string;
  day?: number;
  moment?: any;
  year?: number;
  time?: TimeEntry;
  totalTime?: number;
  edit?: boolean;
}

export interface TimeEntry {
  id?: string;
  date?: Date;
  code?: string;
  hours?: number;
}
