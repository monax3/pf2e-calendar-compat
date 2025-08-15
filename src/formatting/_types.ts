import type { TimeComponents } from "foundry-pf2e/foundry/client/data/_types.mjs";

export interface DateTimeFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'day'> {
    day?: Intl.DateTimeFormatOptions['day'] | 'ordinal'
}

export type Formatter<TOptions extends object = object> = (calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: TOptions) => string;

export type Part = { type: 'separator' | keyof DateTimeFormatOptions, text: string; } | { type: 'blank' };

export type { TimeComponents };
