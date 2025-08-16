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
    componentsToSeason(components: TimeComponents): number | undefined;
    daysInYear(year: number): number;
    timeFromOrdinalDate(year: number, month: number, day: number): number;
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