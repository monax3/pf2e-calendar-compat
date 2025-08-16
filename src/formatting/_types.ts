import type { CalendarData } from 'pf2e-types/foundry/data';
import type { TimeComponents } from 'pf2e-types/foundry/data/types';

import type * as FormatFunctions from './formatters';

export type Formatter<TOptions extends object = object, TComponents extends TimeComponents = TimeComponents> = (calendar: CalendarData<TComponents>, components: TComponents, options?: TOptions) => string;

export type Formatters = keyof typeof FormatFunctions;

export type Part = { text: string; type: 'separator' | keyof DateTimeFormatOptions } | { type: 'blank' };

export interface DateTimeFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'day'> {
    day?: 'ordinal' | Intl.DateTimeFormatOptions['day'];
}

export interface FormatterOptions extends Record<Formatters, object> {
    date: Omit<DateTimeFormatOptions, 'hour12' | 'hour' | 'minute' | 'second' | 'timeStyle'>;
    intl: DateTimeFormatOptions;
    time: Omit<DateTimeFormatOptions, 'dateStyle' | 'day' | 'era' | 'month' | 'weekday' | 'year'>;
}
