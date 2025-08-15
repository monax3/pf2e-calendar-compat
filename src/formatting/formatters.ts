import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';
import {
    getDateSeparator,
    hour,
    numeric,
    weekday,
    month,
    eraYear,
    separated,
    amPm,
    blanked
} from './parts';
import { ordinalString } from '../date';
import { prepareOptions } from './options';
import type { Time } from '../module';
import type { DateTimeFormatOptions } from './_types';

function dateImpl(
    calendar: foundry.data.CalendarConfig,
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
        { type: 'separator', text: options.month === 'long' ? ', ' : separator },
        eraYear('AR', calendar, components, options),
    );
}

function timeImpl(
    calendar: foundry.data.CalendarConfig,
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
    calendar: foundry.data.CalendarConfig,
    components: TimeComponents,
    options: DateTimeFormatOptions,
): string {
    const sep = dateTimeSep(options);

    console.warn(options);

    return separated(
        blanked('dateStyle', dateImpl(calendar, components, options)),
        { type: 'separator', text: sep },
        blanked('timeStyle', timeImpl(calendar, components, options)),
    );
}

export function date(
    calendar: foundry.data.CalendarConfig,
    components: TimeComponents,
    options?: Intl.DateTimeFormatOptions,
): string {
    return dateImpl(calendar, components, prepareOptions(options));
}

export function time(
    calendar: foundry.data.CalendarConfig,
    components: TimeComponents,
    options?: Intl.DateTimeFormatOptions,
): string {
    return timeImpl(calendar, components, prepareOptions(options));
}

export function intl(calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: DateTimeFormatOptions): string {
    const opts = prepareOptions(options);
    return parts(calendar, components, opts);
}

export function system(calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: object): string {
    return `${game.i18n.format(CONFIG.PF2E.worldClock.Date, {
        era: 'AR', // FIXME,
        year: components.year,
        month: separated(month(calendar, components, 'long')),
        day: ordinalString(components.dayOfMonth + 1),
        weekday: separated(weekday(calendar, components, 'long')),
    })
        } (${time(calendar, components, { timeStyle: 'full' })
        })`;
};
