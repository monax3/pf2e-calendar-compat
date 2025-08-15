import type { DateTimeFormatOptions } from "./_types";

const DEFAULT_FORMAT = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' } as const;

function getDateStyle(dateStyle?: DateTimeFormatOptions['dateStyle']): DateTimeFormatOptions {
    switch (dateStyle) {
        case 'full':
            return { weekday: 'long', month: 'long', day: 'ordinal', year: 'numeric', era: 'short' };
        case 'long':
            return { month: 'long', day: 'ordinal', year: 'numeric', era: 'short' };
        case 'medium':
            return { month: 'short', day: 'numeric', year: 'numeric' };
        case 'short':
            return { month: '2-digit', day: '2-digit', year: 'numeric' };
        case undefined:
            return {};
    }
}

function getTimeStyle(timeStyle?: Intl.DateTimeFormatOptions['timeStyle']): Intl.DateTimeFormatOptions {
    switch (timeStyle) {
        case 'full':
        case 'long':
        case 'medium':
            return { hour12: game.pf2e.settings.worldClock.timeConvention === 12, hour: 'numeric', minute: '2-digit', second: '2-digit' };
        case 'short':
            return { hour12: game.pf2e.settings.worldClock.timeConvention === 12, hour: 'numeric', minute: '2-digit' };
        case undefined:
            return {};
    }
}

export function prepareOptions(options: DateTimeFormatOptions = { dateStyle: "full", timeStyle: "full" }): DateTimeFormatOptions {
    const CORE_KEYS = ['timeStyle', 'hour', 'minute', 'second', 'dateStyle', 'year', 'month', 'second'] as const;
    const useDefault = CORE_KEYS.some(key => options[key] != undefined);

    return useDefault
        ? { ...getDateStyle(options.dateStyle), ...getTimeStyle(options.timeStyle), ...options }
        : { hour12: game.pf2e.settings.worldClock.timeConvention === 12, ...DEFAULT_FORMAT };

}