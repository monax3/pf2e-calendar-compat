import { ordinalString } from '../date';

import type { DateTimeFormatOptions, Part, TimeComponents } from './_types';

export function era(
    value: string,
    options: DateTimeFormatOptions['era'],
): string | undefined {
    switch (options) {
        case 'long':
        case 'short':
            return game.i18n.localize(value);
        case 'narrow':
            return game.i18n.localize(value).slice(0, 1);
        default:
            return undefined;
    }
}

export function month(
    calendar: foundry.data.CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions['month'],
): Part {
    const monthName = (index: number): string =>
        game.i18n.localize(calendar.months?.values[index]?.name ?? 'INVALID');

    switch (options) {
        case '2-digit':
            return { type: 'month', text: (components.month + 1).paddedString(2) };
        case 'numeric':
            return { type: 'month', text: (components.month + 1).toString() };
        case 'long':
            return { type: 'month', text: monthName(components.month) };
        case 'short':
            return { type: 'month', text: monthName(components.month).slice(0, 3) };
        case 'narrow':
            return { type: 'month', text: monthName(components.month).slice(0, 1) };
        default:
            return { type: 'blank' };
    }
}

export function numeric(
    type: Part['type'],
    value: number,
    options: 'ordinal' | DateTimeFormatOptions['day' | 'hour' | 'minute'],
): Part {
    switch (options) {
        case 'ordinal':
            return { type, text: ordinalString(value) };
        case '2-digit':
            return { type, text: (value % 100).paddedString(2) };
        case 'numeric':
            return { type, text: value.toString() };
        default:
            return { type: 'blank' };
    }
}

// FIXME
function handlePreEraYears(year: number): number {
    return year > 0 ? year : year - 1;
}

export function amPm(calendar: foundry.data.CalendarData, components: TimeComponents, options: DateTimeFormatOptions): Part {
    if (options.hour12) {
        if (components.hour < 12) { return { type: 'hour12', text: 'AM' }; } else { return { type: 'hour12', text: 'PM' }; }
    } else {
        return { type: 'blank' };
    }
}

export function blanked(type: Part['type'], text: string): Part {
    return text.length > 0
        ? { type, text }
        : { type: 'blank' };
}

export function eraYear(
    eraName: string,
    calendar: foundry.data.CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions,
): Part {
    const year = numeric('year', handlePreEraYears(components.year), options.year);
    const eraValue = era(eraName, options.era);

    if (eraValue != null && year.type !== 'blank') {
        return { type: 'year', text: `${year.text} ${eraValue}` };
    } else if (year.type === 'blank') {
        return { type: 'blank' };
    } else {
        return year;
    }
}

export function getDateSeparator(options: DateTimeFormatOptions): string {
    return options.month === 'long' ? ' ' : '/';
}

export function hour(
    calendar: foundry.data.CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions,
): Part {
    const hour12 = options.hour12
        ? (value: number) => toHour12(value)
        : (value: number) => value;

    switch (options.hour) {
        case '2-digit':
            return { type: 'hour', text: (hour12(components.hour) % 100).paddedString(2) };
        case 'numeric':
            return { type: 'hour', text: hour12(components.hour).toString() };
        default:
            return { type: 'blank' };
    }
}

export function separated(...parts: Part[]): string {
    let sep: false | string | true = false;

    return parts.flatMap((it) => {
        switch (it.type) {
            case 'blank':
                if (sep !== false) { sep = true; }
                return [];
            case 'separator':
                if (sep !== false) { sep = it.text; }
                return [];
            default: {
                const value = typeof sep === 'string' ? [sep, it.text] : [it.text];
                sep = true;
                return value;
            }
        }
    }).join('');
}

export function toHour12(value: number): number {
    if (value === 0) { return 12; } else if (value > 12) { return value - 12; } else { return value; }
}

export function weekday(
    calendar: foundry.data.CalendarData,
    components: TimeComponents,
    options: DateTimeFormatOptions['weekday'],
): Part {
    const weekdayName = (index: number): string => game.i18n.localize(calendar.days.values[index]?.name ?? 'INVALID');

    switch (options) {
        case 'long':
            return { type: 'weekday', text: weekdayName(components.dayOfWeek) };
        case 'short':
            return { type: 'weekday', text: weekdayName(components.dayOfWeek).slice(0, 4) };
        case 'narrow':
            return { type: 'weekday', text: weekdayName(components.dayOfWeek).slice(0, 1) };
        default:
            return { type: 'blank' };
    }
}
