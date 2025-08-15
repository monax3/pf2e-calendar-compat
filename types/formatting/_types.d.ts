import type { CalendarData } from 'pf2e-types/foundry/data';
import type { TimeComponents } from 'pf2e-types/foundry/data/types';
export type Formatter<TOptions extends object = object, TComponents extends TimeComponents = TimeComponents> = (calendar: CalendarData<TComponents>, components: TComponents, options?: TOptions) => string;
export type Part = {
    text: string;
    type: 'separator' | keyof DateTimeFormatOptions;
} | {
    type: 'blank';
};
export interface DateTimeFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'day'> {
    day?: 'ordinal' | Intl.DateTimeFormatOptions['day'];
}
//# sourceMappingURL=_types.d.ts.map