import type { TimeComponents } from 'pf2e-types/foundry/data/types';
import { ImprovedCalendar } from './improved-calendar';
export declare class GregorianCalendar extends ImprovedCalendar {
    static EPOCH_SECONDS: number;
    get epoch_seconds(): number;
    componentsToTime(components: Partial<TimeComponents>): number;
    daysInYear(year: number): number;
    endOfWeek(components: TimeComponents): TimeComponents;
    isLeapYear(year: number): boolean;
    startOfWeek(components: TimeComponents): TimeComponents;
    timeToComponents(seconds?: number): TimeComponents;
    protected componentsToDate(components: TimeComponents): Date;
    protected dateToTime(date: Date): number;
    protected timeToDate(seconds: number): Date;
}
//# sourceMappingURL=gregorian-calendar.d.ts.map