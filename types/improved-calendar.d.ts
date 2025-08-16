import type { CalendarConfigSeason, TimeComponents } from 'pf2e-types/foundry/data/types';
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