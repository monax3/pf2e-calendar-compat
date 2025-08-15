import type { CalendarData } from 'pf2e-types/foundry/data';
import type { TimeComponents } from 'pf2e-types/foundry/data/types';
import type { DateTimeFormatOptions } from './_types';
export declare function date(calendar: CalendarData, components: TimeComponents, options?: Intl.DateTimeFormatOptions): string;
export declare function intl(calendar: CalendarData, components: TimeComponents, options?: DateTimeFormatOptions): string;
export declare function system(calendar: CalendarData, components: TimeComponents, options?: object): string;
export declare function time(calendar: CalendarData, components: TimeComponents, options?: Intl.DateTimeFormatOptions): string;
//# sourceMappingURL=formatters.d.ts.map