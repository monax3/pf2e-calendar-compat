import type { CalendarData } from 'pf2e-types/foundry/data';
import type { TimeComponents } from 'pf2e-types/foundry/data/types';

import { ordinalString } from '../date';
import { CalendarPF2e } from '../pf2e-calendar';

import type { DateTimeFormatOptions } from './_types';
import { prepareOptions } from './options';
import {
    amPm,
    blanked,
    eraYear,
    getDateSeparator,
    hour,
    month,
    numeric,
    separated,
    weekday,
} from './parts';

function dateImpl(
    calendar: CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions,
): string {
    const separator = getDateSeparator(options);

    return separated(
        weekday(calendar, components, options.weekday),
        { type: 'separator', text: ', ' },
        month(calendar, components, options.month),
        { type: 'separator', text: separator },
        numeric('day', components.dayOfMonth + 1, options.day),
        ...calendar instanceof CalendarPF2e
            ? [{ type: 'separator' as const, text: options.month === 'long' ? ', ' : separator },
                eraYear(calendar.eraName, calendar, components, options)]
            : [],
    );
}

function dateTimeSep(options: DateTimeFormatOptions): string {
    switch (options.dateStyle) {
        case 'full':
        case 'long':
            return ' at ';
        case 'medium':
        case 'short':
        case undefined:
            return ', ';
    }
}

function parts(
    calendar: CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions,
): string {
    const sep = dateTimeSep(options);

    return separated(
        blanked('dateStyle', dateImpl(calendar, components, options)),
        { type: 'separator', text: sep },
        blanked('timeStyle', timeImpl(calendar, components, options)),
    );
}

function timeImpl(
    calendar: CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions,
): string {
    return separated(
        hour(calendar, components, options),
        { type: 'separator', text: ':' },
        numeric('minute', components.minute, options.minute),
        { type: 'separator', text: ':' },
        numeric('second', components.second, options.second),
        { type: 'separator', text: ' ' },
        amPm(calendar, components, options),
    );
}

export function date(
    calendar: CalendarData,
    components: TimeComponents,
    options?: Intl.DateTimeFormatOptions,
): string {
    return dateImpl(calendar, components, prepareOptions(options));
}

export function intl(calendar: CalendarData, components: TimeComponents, options?: DateTimeFormatOptions): string {
    const opts = prepareOptions(options);
    return parts(calendar, components, opts);
}

export function system(calendar: CalendarData, components: TimeComponents, options?: object): string {
    return `${game.i18n.format(CONFIG.PF2E.worldClock.Date, {
        day: ordinalString(components.dayOfMonth + 1),
        era: calendar instanceof CalendarPF2e ? calendar.eraName : '',
        month: separated(month(calendar, components, 'long')),
        weekday: separated(weekday(calendar, components, 'long')),
        year: components.year,
    })
    } (${time(calendar, components, { timeStyle: 'full' })
    })`;
}

export function time(
    calendar: CalendarData,
    components: TimeComponents,
    options?: Intl.DateTimeFormatOptions,
): string {
    return timeImpl(calendar, components, prepareOptions(options));
}
