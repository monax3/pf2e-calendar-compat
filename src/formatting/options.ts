import type { DateTimeFormatOptions } from './_types';

const DEFAULT_FORMAT = {
    day: 'numeric', hour: 'numeric', minute: 'numeric', month: 'numeric', second: 'numeric', year: 'numeric',
} as const;

function getDateStyle(dateStyle?: DateTimeFormatOptions['dateStyle']): DateTimeFormatOptions {
    switch (dateStyle) {
        case 'full':
            return { day: 'ordinal', era: 'short', month: 'long', weekday: 'long', year: 'numeric' };
        case 'long':
            return { day: 'ordinal', era: 'short', month: 'long', year: 'numeric' };
        case 'medium':
            return { day: 'numeric', month: 'short', year: 'numeric' };
        case 'short':
            return { day: '2-digit', month: '2-digit', year: 'numeric' };
        case undefined:
            return {};
    }
}

function getTimeStyle(timeStyle?: Intl.DateTimeFormatOptions['timeStyle']): Intl.DateTimeFormatOptions {
    switch (timeStyle) {
        case 'full':
        case 'long':
        case 'medium':
            return { hour: 'numeric', hour12: game.pf2e.settings.worldClock.timeConvention === 12, minute: '2-digit', second: '2-digit' };
        case 'short':
            return { hour: 'numeric', hour12: game.pf2e.settings.worldClock.timeConvention === 12, minute: '2-digit' };
        case undefined:
            return {};
    }
}

const FULL_FORMAT = { dateStyle: 'full', timeStyle: 'full' } satisfies Intl.DateTimeFormatOptions;

export function prepareOptions(options: DateTimeFormatOptions = FULL_FORMAT): DateTimeFormatOptions {
    const CORE_KEYS = [
        'timeStyle',
        'hour',
        'minute',
        'second',
        'dateStyle',
        'year',
        'month',
        'second',
        'weekday',
    ] as const;
    const useDefault = CORE_KEYS.some(key => options[key] !== undefined);

    return useDefault
        ? { ...getDateStyle(options.dateStyle), ...getTimeStyle(options.timeStyle), ...options }
        : { hour12: game.pf2e.settings.worldClock.timeConvention === 12, ...DEFAULT_FORMAT };
}
