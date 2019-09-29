export function isToday(obj1: any, obj2: any): boolean {
    return obj1.day === obj2.day && obj1.year === obj2.year && obj1.month === obj2.month;
}