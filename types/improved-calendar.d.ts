import type { CalendarConfigSeason, TimeComponents, TimeFormatter } from 'pf2e-types/foundry/data/types';
import type { DateTimeFormatOptions } from './formatting/_types';
interface SeasonByDay extends CalendarConfigSeason {
    dayEnd: number;
    dayStart: number;
}
interface SeasonByMonth extends CalendarConfigSeason {
    monthEnd: number;
    monthStart: number;
}
export declare class ImprovedCalendar extends foundry.data.CalendarData {
    get daysInWeek(): number;
    get firstWeekday(): number;
    get monthsInYear(): number;
    componentsToSeason(components: TimeComponents): number | undefined;
    daysInMonth(month: number, year?: number): number;
    daysInYear(year: number): number;
    timeFromOrdinalDate(year: number, month: number, day: number): number;
    format(time: number, formatter: 'intl', options: DateTimeFormatOptions): string;
    format(time: number, formatter: 'time', options: Omit<DateTimeFormatOptions, 'dateStyle' | 'day' | 'era' | 'month' | 'weekday' | 'year'>): string;
    format(time: number, formatter: 'date', options: Omit<DateTimeFormatOptions, 'hour12' | 'hour' | 'minute' | 'second' | 'timeStyle'>): string;
    format(time?: number | TimeComponents, formatter?: string | TimeFormatter, options?: object): string;
    addDays(components: TimeComponents, days: number): TimeComponents;
    addMonths(components: TimeComponents, months: number): TimeComponents;
    endOfMonth(components: TimeComponents): TimeComponents;
    endOfWeek(components: TimeComponents): TimeComponents;
    startOfMonth(components: TimeComponents): TimeComponents;
    startOfWeek(components: TimeComponents): TimeComponents;
    protected endOfWeekDelta(components: TimeComponents): number;
    protected resolvePartialComponents(components: Partial<TimeComponents>): TimeComponents;
    protected seasonByDay(day: number, seasons: SeasonByDay[]): number | undefined;
    protected seasonByMonth(monthIndex: number, seasons: SeasonByMonth[]): number | undefined;
    protected startOfWeekDelta(components: TimeComponents): number;
}
export {};
//# sourceMappingURL=improved-calendar.d.ts.map