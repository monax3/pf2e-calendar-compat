import type { TimeComponents } from 'pf2e-types/foundry/data/types';

import { getDayOfWeek, getDayOfYear } from './date';
import { ImprovedCalendar } from './improved-calendar';

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

export class GregorianCalendar extends ImprovedCalendar {

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

    override daysInYear(year: number): number {
        return this.isLeapYear(year) ? 366 : 365;
    }

    override endOfWeek(components: TimeComponents): TimeComponents {
        const date = this.componentsToDate(components);
        date.setDate(date.getDate() + this.endOfWeekDelta(components));
        return this.timeToComponents(this.dateToTime(date));
    }

    override isLeapYear(year: number): boolean {
        return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
    }

    override startOfWeek(components: TimeComponents): TimeComponents {
        const date = this.componentsToDate(components);
        date.setDate(date.getDate() - this.startOfWeekDelta(components));
        return this.timeToComponents(this.dateToTime(date));
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

    protected timeToDate(seconds: number): Date {
        return new Date((seconds + this.epoch_seconds) * 1000);
    }

}
