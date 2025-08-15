import type { TimeComponents } from "foundry-pf2e/foundry/client/data/_types.mjs";
import { ordinalString } from './date';

function numeric(value: number, options: Intl.DateTimeFormatOptions['day' | 'hour' | 'minute']): string | undefined {
    switch (options) {
        case '2-digit':
            return (value % 100).paddedString(2);
        case 'numeric':
            return String(value);
        case undefined:
            return undefined;
    }
}

function era(value: string, options: Intl.DateTimeFormatOptions['era']): string | undefined {
    switch (options) {
        case 'long':
        case 'short':
            return value;
        case 'narrow':
            return value.slice(0, 1);
        case undefined:
            return undefined;
    }
}

function eraYear(item: { era?: string; eraYear?: number; year?: number; }, options: Intl.DateTimeFormatOptions): string | undefined {
    item.eraYear ??= item.year;

    if (item.era !== undefined && item.eraYear !== undefined) {
        const eraValue = era(item.era, options.era);
        if (eraValue !== undefined) {
            const yearValue = numeric(item.eraYear, options.year);
            return yearValue === undefined ? yearValue : `${yearValue} ${eraValue}`;
        }
    }

    return item.year !== undefined ? numeric(item.year, options.year) : undefined;
}

function month(calendar: foundry.data.CalendarConfig, index: number, options: Intl.DateTimeFormatOptions['month']): string {
    const monthName = (index: number) => game.i18n.localize(calendar.months?.values[index]?.name ?? "INVALID");

    switch (options) {
        case '2-digit':
            return (index + 1).paddedString(2);
        case 'numeric':
            return String(index);
        case undefined:
        case 'long':
            return monthName(index);
        case 'short':
            return monthName(index).slice(0, 3);
        case 'narrow':
            return monthName(index).slice(0, 1);
    }
}

function weekday(calendar: foundry.data.CalendarConfig, index: number, options: Intl.DateTimeFormatOptions['weekday']): string | undefined {
    const weekdayName = (index: number) => game.i18n.localize(calendar.days.values[index]?.name ?? "INVALID");

    switch (options) {
        case 'long':
            return weekdayName(index);
        case 'short':
            return weekdayName(index).slice(0, 4);
        case 'narrow':
            return weekdayName(index).slice(0, 1);
        case undefined:
            return undefined;
    }
}

function hour12(hour: number): number {
    if (hour === 0) return 12;
    else if (hour > 12) return hour - 12;
    else return hour;
}

function ampm(hour: number): string {
    if (hour < 12) return 'AM';
    else return 'PM';
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

function getDateStyle(dateStyle?: Intl.DateTimeFormatOptions['dateStyle']): Intl.DateTimeFormatOptions {
    switch (dateStyle) {
        case 'full':
            return { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', era: 'short' };
        case 'long':
            return { month: 'long', day: 'numeric', year: 'numeric', era: 'short' };
        case 'medium':
            return { month: 'short', day: 'numeric', year: 'numeric' };
        case 'short':
            return { month: '2-digit', day: '2-digit', year: 'numeric' };
        case undefined:
            return {};
    }
}

const DEFAULT_FORMAT = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' } as const;

function prepareOptions(options: Intl.DateTimeFormatOptions = { dateStyle: "full", timeStyle: "full" }): Intl.DateTimeFormatOptions {
    const CORE_KEYS = ['timeStyle', 'hour', 'minute', 'second', 'dateStyle', 'year', 'month', 'second'] as const;
    const useDefault = CORE_KEYS.some(key => options[key] != undefined);

    return useDefault
        ? { ...getDateStyle(options.dateStyle), ...getTimeStyle(options.timeStyle), ...options }
        : DEFAULT_FORMAT;

}

function formatIntl(calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: Intl.DateTimeFormatOptions): string {
    const opts = prepareOptions(options);

    const date = opts.year || opts.month || opts.day
        ? formatDate(calendar, components, opts) : undefined;
    const time = opts.hour || opts.minute || opts.second
        ? formatTime(calendar, components, opts) : undefined;

    if (date == undefined) return time ?? '';
    if (time == undefined) return date;

    switch (opts.dateStyle) {
        case 'full':
        case 'long':
            return `${date} at ${time}`;
        case 'medium':
        case 'short':
        case undefined:
            return `${date}, ${time}`;
    }
}

function formatTimeImpl(calendar: foundry.data.CalendarConfig, components: TimeComponents, options: Intl.DateTimeFormatOptions): string[] {
    const hourValue = options.hour12 ? hour12(components.hour) : components.hour;

    const fields: (string | undefined)[] = [
        numeric(hourValue, options.hour),
        numeric(components.minute, options.minute),
        numeric(components.second, options.second)
    ].filter(f => f != undefined);

    if (options.hour12) {
        return [fields.join(':'), ampm(components.hour)];
    } else {
        return [fields.join(':')];
    }
}

function formatTime(calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: Intl.DateTimeFormatOptions): string {
    const opts = prepareOptions(options);

    return formatTimeImpl(calendar, components, opts).join(' ');
}

function formatDateImpl(calendar: foundry.data.CalendarConfig, components: TimeComponents, options: Intl.DateTimeFormatOptions): string {
    const fields: (string | undefined)[] = [
        month(calendar, components.month, options.month),
        numeric(components.dayOfMonth + 1, options.day),
        eraYear({ year: components.year, era: 'AR' }, options),
    ].filter(f => f != undefined);

    const sep = options.month && ['2-digit', 'numeric'].includes(options.month) ? '/' : ' ';
    const date = fields.join(sep);

    const weekdayName = weekday(calendar, components.dayOfWeek, options.weekday);

    return weekdayName != undefined ? `${weekdayName}, ${date}` : date;
}

function formatDateLong(calendar: foundry.data.CalendarConfig, components: TimeComponents, dateStyle: 'full' | 'long') {
    const parts = [
        weekday(calendar, components.dayOfWeek, dateStyle === 'full' ? 'long' : undefined),
        ', ',
        month(calendar, components.month, 'long'),
        ' ',
        ordinalString(components.dayOfMonth + 1),
        ', ',
        eraYear({ year: components.year, era: 'AR' }, { era: 'short', year: 'numeric' }),
    ];

    switch (dateStyle) {
        case 'full':
            return parts.join('');
        case 'long':
            return parts.slice(2).join('');
    }
}

function formatDate(calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: Intl.DateTimeFormatOptions): string {
    const opts = prepareOptions(options);

    switch (opts.dateStyle) {
        case 'full':
        case 'long':
            return formatDateLong(calendar, components, opts.dateStyle);
        case 'medium':
        case 'short':
        case undefined:
            return formatDateImpl(calendar, components, opts);
    }
}

function formatSystem(calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: object): string {
    const date =
        game.i18n.format(CONFIG.PF2E.worldClock.Date, {
            era: 'AR', // FIXME,
            year: components.year,
            month: month(calendar, components.month, 'long'),
            day: ordinalString(components.dayOfMonth + 1),
            weekday: weekday(calendar, components.dayOfWeek, 'long'),
        });

    const time = formatTime(calendar, components, { timeStyle: 'full' });

    return `${date} (${time})`;
}

export { formatIntl, formatTime, formatDate, formatSystem };
