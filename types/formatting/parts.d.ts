import type { CalendarData } from 'pf2e-types/foundry/data';
import type { TimeComponents } from 'pf2e-types/foundry/data/types';
import type { DateTimeFormatOptions, Part } from './_types';
export declare function era(value: string, options: DateTimeFormatOptions['era']): string | undefined;
export declare function month(calendar: CalendarData, components: TimeComponents, options: DateTimeFormatOptions['month']): Part;
export declare function numeric(type: Part['type'], value: number, options: 'ordinal' | DateTimeFormatOptions['day' | 'hour' | 'minute']): Part;
export declare function amPm(calendar: CalendarData, components: TimeComponents, options: DateTimeFormatOptions): Part;
export declare function blanked(type: Part['type'], text: string): Part;
export declare function eraYear(eraName: string, calendar: CalendarData, components: TimeComponents, options: DateTimeFormatOptions): Part;
export declare function getDateSeparator(options: DateTimeFormatOptions): string;
export declare function hour(calendar: CalendarData, components: TimeComponents, options: DateTimeFormatOptions): Part;
export declare function separated(...parts: Part[]): string;
export declare function toHour12(value: number): number;
export declare function weekday(calendar: CalendarData, components: TimeComponents, options: DateTimeFormatOptions['weekday']): Part;
//# sourceMappingURL=parts.d.ts.map