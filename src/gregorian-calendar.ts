import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';
import { getDayOfWeek, getDayOfYear } from './date';

const DEFAULT_COMPONENTS: TimeComponents = {
    year: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    month: 0,
    dayOfMonth: 0,
    dayOfWeek: 0,
    season: 0,
    leapYear: false
};

export class GregorianCalendar extends foundry.data.CalendarData {
    static EPOCH_SECONDS = -62167219200; // Year 0 in seconds since UNIX epoch

    get epoch_seconds(): number {
        return GregorianCalendar.EPOCH_SECONDS;
    }

    protected timeToDate(seconds: number) {
        return new Date((seconds + this.epoch_seconds) * 1000);
    }

    protected dateToTime(date: Date): number {
        return Math.floor(date.getTime() / 1000) - this.epoch_seconds;
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

        components.season = this.componentsToSeason(components) ?? -1; //FIXME fix types

        return components;
    }

   override componentsToTime(components: Partial<TimeComponents>): number {
        return this.dateToTime(
            this.componentsToDate(
                {
                    ...DEFAULT_COMPONENTS,
                    ...components,
                }
        ));
    }

    protected componentsToDate(components: TimeComponents): Date {
        const { day, dayOfMonth, month, year, hour, minute, second } =
            components;

        const date = new Date(0);

        date.setUTCFullYear(year, month, dayOfMonth + 1);

        if (dayOfMonth == 0 && month == 0 && day > 0) {
            date.setUTCDate(day + 1);
        }

        date.setUTCHours(hour, minute, second);

        return date;
    }

     override isLeapYear(year: number): boolean {
        return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    }

    componentsToSeason(components: TimeComponents): number | undefined {
        if (!this.seasons || !this.seasons.values) {
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

    protected seasonByMonth(monthIndex: number, seasons: { monthStart: number, monthEnd: number }[]): number | undefined {        
        const month = this.months?.values[monthIndex]?.ordinal;
        if (month == undefined) { return undefined; }

        const season = seasons.findIndex(s =>
            s.monthEnd! >= s.monthStart!
                ? month >= s.monthStart && month <= s.monthEnd
                : month >= s.monthStart || month <= s.monthEnd
        );

        return season > -1 ? season : undefined;
    }

    protected seasonByDay(day: number, seasons: { dayStart: number, dayEnd: number }[]): number | undefined {
        const season = seasons.findIndex(s =>
            s.dayEnd! >= s.dayStart!
                ? day >= s.dayStart && day <= s.dayEnd
                : day >= s.dayStart || day <= s.dayEnd
        );

        return season > -1 ? season : undefined;
    }
}

function isSeasonsByDay(values: foundry.data.CalendarConfigSeason[]): values is SeasonByDay[] {
    // Only check first season, if you're mixing by-month and by-day
    // you should be expecting errors
    const first = values[0];
    return typeof first?.dayStart == 'number' &&
        typeof first?.dayEnd == 'number';
}

function isSeasonsByMonth(values: foundry.data.CalendarConfigSeason[]): values is SeasonByMonth[] {
    const first = values[0];
    return typeof first?.monthStart == 'number' &&
        typeof first?.monthEnd == 'number';
}

interface SeasonByMonth extends foundry.data.CalendarConfigSeason {
    monthStart: number
    monthEnd: number
}

interface SeasonByDay extends foundry.data.CalendarConfigSeason {
    dayStart: number
    dayEnd: number
}
