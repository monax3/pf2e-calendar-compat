import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';

export type Formatter<TOptions extends object = object, TComponents extends TimeComponents = TimeComponents> = (calendar: foundry.data.CalendarData<TComponents>, components: TComponents, options?: TOptions) => string;

export type Part = { text: string; type: 'separator' | keyof DateTimeFormatOptions } | { type: 'blank' };

export interface DateTimeFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'day'> {
    day?: 'ordinal' | Intl.DateTimeFormatOptions['day'];
}

export type { TimeComponents };
