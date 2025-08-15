import type { CalendarData } from 'pf2e-types/foundry/data';
import type { AbsalomReckoning } from './configs';
import type { GregorianCalendar } from './gregorian-calendar';
import type { ImprovedCalendar } from './improved-calendar';
import type { CalendarConfigPF2e, CalendarPF2e } from './pf2e-calendar';
export interface CalendarCompatModule extends foundry.packages.Module {
    isCalendarPF2e: typeof isCalendarPF2e;
    AbsalomReckoning: typeof AbsalomReckoning;
    CalendarPF2e: typeof CalendarPF2e;
    GregorianCalendar: typeof GregorianCalendar;
    ImprovedCalendar: typeof ImprovedCalendar;
}
export declare function isCalendarPF2e<TConfig extends CalendarConfigPF2e>(calendar: CalendarData | CalendarPF2e, era: TConfig['era']): calendar is CalendarPF2e;
export declare function isCalendarPF2e(calendar: CalendarData | CalendarPF2e): calendar is CalendarPF2e;
//# sourceMappingURL=types.d.ts.map