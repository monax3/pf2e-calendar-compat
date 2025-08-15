import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';

import { getDayOfWeek, getDayOfYear } from './date';

const DEFAULT_COMPONENTS: TimeComponents = {
    day: 0,
    dayOfMonth: 0,
    dayOfWeek: 0,
    hour: 0,
    leapYear: false,
    minute: 0,
    month: 0,
    season: 0,
    second: 0,
    year: 0,
};

interface SeasonByDay extends foundry.data.CalendarConfigSeason {
    dayEnd: number;
    dayStart: number;
}

interface SeasonByMonth extends foundry.data.CalendarConfigSeason {
    monthEnd: number;
    monthStart: number;
}

function isSeasonsByDay(values: foundry.data.CalendarConfigSeason[]): values is SeasonByDay[] {
    // Only check first season, if you're mixing by-month and by-day
    // you should be expecting errors
    const first = values[0];
    return typeof first?.dayStart === 'number'
        && typeof first.dayEnd === 'number';
}

function isSeasonsByMonth(values: foundry.data.CalendarConfigSeason[]): values is SeasonByMonth[] {
    const first = values[0];
    return typeof first?.monthStart == 'number'
        && typeof first.monthEnd == 'number';
}

export class GregorianCalendar extends foundry.data.CalendarData {

    static EPOCH_SECONDS = -62_167_219_200; // Year 0 in seconds since UNIX epoch

    get epoch_seconds(): number {
        return GregorianCalendar.EPOCH_SECONDS;
    }

    override componentsToTime(components: Partial<TimeComponents>): number {
        return this.dateToTime(
            this.componentsToDate(
                {
                    ...DEFAULT_COMPONENTS,
                    ...components,
                },
            ),
        );
    }

    override isLeapYear(year: number): boolean {
        return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
    }

    override timeToComponents(seconds = 0): TimeComponents {
        const date = this.timeToDate(seconds);

        const day = getDayOfYear(date);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();

        const components: TimeComponents = {
            day,
            dayOfMonth: date.getUTCDate() - 1,
            dayOfWeek: getDayOfWeek(date),
            hour: date.getUTCHours(),
            minute: date.getUTCMinutes(),
            month,
            second: date.getUTCSeconds(),
            year,

            leapYear: this.isLeapYear(year),
            season: 0,
        };

        components.season = this.componentsToSeason(components) ?? -1; // FIXME fix types

        return components;
    }

    componentsToSeason(components: TimeComponents): number | undefined {
        if (!this.seasons?.values) {
            return;
        }

        if (isSeasonsByDay(this.seasons.values)) {
            return this.seasonByDay(components.day, this.seasons.values);
        } else if (isSeasonsByMonth(this.seasons.values)) {
            return this.seasonByMonth(components.month, this.seasons.values);
        }

        console.warn(`Calendar ${this.name} has invalid season data`);
        return;
    }

    protected componentsToDate(components: TimeComponents): Date {
        const {
            day, dayOfMonth, hour, minute, month, second, year,
        }
            = components;

        const date = new Date(0);

        date.setUTCFullYear(year, month, dayOfMonth + 1);

        if (dayOfMonth === 0 && month === 0 && day > 0) {
            date.setUTCDate(day + 1);
        }

        date.setUTCHours(hour, minute, second);

        return date;
    }

    protected dateToTime(date: Date): number {
        return Math.floor(date.getTime() / 1000) - this.epoch_seconds;
    }

    protected seasonByDay(day: number, seasons: SeasonByDay[]): number | undefined {
        const season = seasons.findIndex(s =>
            s.dayEnd >= s.dayStart
                ? day >= s.dayStart && day <= s.dayEnd
                : day >= s.dayStart || day <= s.dayEnd);

        return season === -1 ? undefined : season;
    }

    protected seasonByMonth(monthIndex: number, seasons: SeasonByMonth[]): number | undefined {
        const month = this.months?.values[monthIndex]?.ordinal;
        if (month === undefined) { return undefined; }

        const season = seasons.findIndex(s =>
            s.monthEnd >= s.monthStart
                ? month >= s.monthStart && month <= s.monthEnd
                : month >= s.monthStart || month <= s.monthEnd);

        return season === -1 ? undefined : season;
    }

    protected timeToDate(seconds: number): Date {
        return new Date((seconds + this.epoch_seconds) * 1000);
    }

}
