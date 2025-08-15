import type { TimeComponents } from 'pf2e-types/foundry/data/types';
import { GregorianCalendar } from './gregorian-calendar';
type CalendarDataSchemaPF2e = foundry.data.CalendarDataSchema & {
    era: foundry.data.fields.StringField;
    gregorianOffset: foundry.data.fields.NumberField;
};
export type CalendarConfigPF2e = foundry.data.fields.ModelPropsFromSchema<CalendarDataSchemaPF2e>;
export declare function isCalendarConfigPF2e(config: foundry.data.types.CalendarConfig): config is CalendarConfigPF2e;
export declare class CalendarPF2e extends GregorianCalendar {
    #private;
    readonly _source: foundry.data.fields.SourceFromSchema<CalendarDataSchemaPF2e>;
    era?: string;
    gregorianOffset?: number;
    pf2e: boolean;
    get eraName(): string;
    get worldCreatedOn(): Date;
    protected componentsToDate(components: TimeComponents): Date;
    static defineSchema(): CalendarDataSchemaPF2e;
    get epoch_seconds(): number;
    isLeapYear(year: number): boolean;
    get name(): string;
    set name(value: string);
    timeToComponents(seconds?: number): TimeComponents;
    protected componentsFromGregorian(components: TimeComponents): TimeComponents;
    protected componentsToGregorian(components: TimeComponents): TimeComponents;
}
export {};
//# sourceMappingURL=pf2e-calendar.d.ts.map