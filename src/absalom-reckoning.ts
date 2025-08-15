import type { TimeComponents } from "foundry-pf2e/foundry/client/data/_types.mjs";
import { formatIntl, formatTime, formatDate } from './format';
import { getDayOfWeek, getDayOfYear } from "./date";

export const CalendarConfig = {
    name: "Absalom Reckoning",
    description: "Absalom Reckoning takes its origin from the moment the god Aroden lifted the Starstone from the depths of the Inner Sea and founded the city of Absalom, an event dated to 1 Abadius, 1 AR. This event also ushered in the Age of Enthronement in which human nations began to be founded in the Inner Sea region inspired by Aroden's example.",
    years: {
        yearZero: 0,
        firstWeekday: 0,
        leapYear: {
            leapStart: 8,
            leapInterval: 4,
        },
    },
    months: {
        values: [
            { name: 'PF2E.WorldClock.AR.Months.January', ordinal: 1, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.February', ordinal: 2, days: 28, leapDays: 29 },
            { name: 'PF2E.WorldClock.AR.Months.March', ordinal: 3, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.April', ordinal: 4, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.May', ordinal: 5, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.June', ordinal: 6, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.July', ordinal: 7, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.August', ordinal: 8, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.September', ordinal: 9, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.October', ordinal: 10, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.November', ordinal: 11, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.December', ordinal: 12, days: 31 },
        ]
    },
    days: {
        values: [
            { name: 'PF2E.WorldClock.AR.Weekdays.Monday', ordinal: 1 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Tuesday', ordinal: 2 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Wednesday', ordinal: 3 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Thursday', ordinal: 4 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Friday', ordinal: 5 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Saturday', ordinal: 6 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Sunday', ordinal: 7, isRestDay: true }
        ],
        daysPerYear: 365,
        hoursPerDay: 24,
        minutesPerHour: 60,
        secondsPerMinute: 60,
    },
    seasons: {
        values: [
            { name: "CALENDAR.GREGORIAN.Spring", monthStart: 3, monthEnd: 5 },
            { name: "CALENDAR.GREGORIAN.Summer", monthStart: 6, monthEnd: 8 },
            { name: "CALENDAR.GREGORIAN.Fall", monthStart: 9, monthEnd: 11 },
            { name: "CALENDAR.GREGORIAN.Winter", monthStart: 12, monthEnd: 2 }
        ]
    }
};

export class Calendar extends foundry.data.CalendarData {
    override timeToComponents(seconds: number = 0): TimeComponents {
        const date = this.#timeToDate(seconds);

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
            year: year + 2700,

            leapYear: this.isLeapYear(year),
            season: this.getSeason(month),
        };

        return components;
    }

    override componentsToTime(components: Partial<TimeComponents>): number {
        return this.#dateToTime(this.#componentsToDate(components));
    }

    override isLeapYear(year: number): boolean {
        return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    }

    getSeason(monthIndex: number): number {
        const month = this.months!.values[monthIndex ?? 0]!.ordinal;

        return this.seasons!.values.findIndex(season =>
            season.monthEnd! >= season.monthStart!
                ? month >= season.monthStart! && month <= season.monthEnd!
                : month >= season.monthStart! || month <= season.monthEnd!);
    }

    #worldCreatedOn?: Date = undefined;

    get worldCreatedOn(): Date {
        if (this.#worldCreatedOn === undefined) {
            this.#worldCreatedOn = new Date(Date.parse(game.pf2e.settings.worldClock.worldCreatedOn!));
        }

        return this.#worldCreatedOn;
    }

    #timeToDate(seconds: number): Date {
        return new Date(this.worldCreatedOn.getTime() + seconds * 1000);
    }

    #dateToTime(date: Date): number {
        return Math.floor(date.getTime() - this.worldCreatedOn.getTime()) / 1000;
    }

    #now(): Date {
        return this.#timeToDate(game.time.worldTime);
    }

    #componentsToDate(components: Partial<TimeComponents>): Date {
        const { day, dayOfMonth, month, year, hour, minute, second } = components;

        const date = this.#now();

        if (year != undefined) date.setUTCFullYear(year - 2700);

        if (dayOfMonth != undefined && month != undefined) {
            date.setUTCMonth(month);
            date.setUTCDate(dayOfMonth + 1);
        } else {
            date.setUTCMonth(0);
            date.setUTCDate(1);
            if (day) {
                date.setUTCDate(day + 1);
            }
        }

        if (hour != undefined) date.setUTCHours(hour);
        if (minute != undefined) date.setUTCMinutes(minute);
        if (second != undefined) date.setUTCSeconds(second);

        return date;
    }

    static intl = formatIntl;
    static time = formatTime;
    static date = formatDate;
}
