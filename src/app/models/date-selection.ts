export interface DateSelection {
  action?: string;
  date?: any;
  type?: string;
}

export type ActionsEnum = 'add' | 'edit' | 'delete';
export const ActionsEnum = {
    Add: 'add' as ActionsEnum,
    Edit: 'edit' as ActionsEnum,
    Delete: 'delete' as ActionsEnum
}

export type DateTypesEnum = 'native' | 'moment';
export const DateTypesEnum = {
    Moment: 'moent' as DateTypesEnum,
    Native: 'native' as DateTypesEnum
}
