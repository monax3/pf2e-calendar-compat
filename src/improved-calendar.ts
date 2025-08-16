import type { CalendarConfigSeason, TimeComponents, TimeFormatter } from 'pf2e-types/foundry/data/types';

import type { FormatterOptions, Formatters } from './formatting/_types';

interface SeasonByDay extends CalendarConfigSeason {
    dayEnd: number;
    dayStart: number;
}

interface SeasonByMonth extends CalendarConfigSeason {
    monthEnd: number;
    monthStart: number;
}

function isSeasonsByDay(values: CalendarConfigSeason[]): values is SeasonByDay[] {
    // Only check first season, if you're mixing by-month and by-day
    // you should be expecting errors
    const first = values[0];
    return typeof first?.dayStart === 'number'
        && typeof first.dayEnd === 'number';
}

function isSeasonsByMonth(values: CalendarConfigSeason[]): values is SeasonByMonth[] {
    const first = values[0];
    return typeof first?.monthStart == 'number'
        && typeof first.monthEnd == 'number';
}

export class ImprovedCalendar extends foundry.data.CalendarData {

    get daysInWeek(): number {
        return this.days.values.length;
    }

    get firstWeekday(): number {
        return this.years.firstWeekday;
    }

    get monthsInYear(): number {
        return this.months?.values.length ?? 1;
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

    daysInMonth(month: number, year?: number): number {
        const data = this.months?.values[month];

        if (data === undefined) {
            console.warn('Calendar does not have a definition for this month');
            return 0;
        }

        const isLeapYear = year === undefined ? false : this.isLeapYear(year);
        return isLeapYear ? data.leapDays ?? data.days : data.days;
    }

    daysInYear(year: number): number {
        if (this.months === null) {
            console.warn('Calendar does not have defined years');
            return 0;
        }

        const isLeapYear = this.isLeapYear(year);
        const days = this.months.values.reduce((acc, month) =>
            acc + (isLeapYear ? month.leapDays ?? month.days : month.days), 0);

        return days;
    }

    timeFromOrdinalDate(year: number, month: number, day: number): number {
        return this.componentsToTime({
            dayOfMonth: day - 1,
            month: month - 1,
            year,
        });
    }

    // Date helpers

    override format<F extends Formatters>(time: number, formatter: F, options: FormatterOptions[F]): string;
    override format(time?: number | TimeComponents, formatter?: string | TimeFormatter, options?: object): string;
    override format(time?: number | TimeComponents, formatter?: string | TimeFormatter, options?: object): string {
        return super.format(time, formatter, options);
    }

    addDays(components: TimeComponents, days: number): TimeComponents {
        let year = components.year;
        let day = components.day + days;

        while (day < 0) {
            year -= 1;
            day += this.daysInYear(year);
        }

        while (day >= this.daysInYear(year)) {
            day -= this.daysInYear(year);
            year += 1;
        }

        return this.resolvePartialComponents({ day, year });
    }

    addMonths(components: TimeComponents, months: number): TimeComponents {
        let year = components.year;
        let month = components.month + months;

        while (month < 0) {
            year -= 1;
            month += this.monthsInYear;
        }

        while (month >= this.monthsInYear) {
            month -= this.monthsInYear;
            year += 1;
        }

        const dayMax = this.daysInMonth(month, year) - 1;
        return this.resolvePartialComponents({ day: Math.min(dayMax, components.dayOfMonth), month, year });
    }

    endOfMonth(components: TimeComponents): TimeComponents {
        const dayOfMonth = this.daysInMonth(components.month, components.year) - 1;
        return this.resolvePartialComponents({ dayOfMonth, month: components.month, year: components.year });
    }

    endOfWeek(components: TimeComponents): TimeComponents {
        return this.addDays(components, this.endOfWeekDelta(components));
    }

    startOfMonth(components: TimeComponents): TimeComponents {
        return this.resolvePartialComponents({ dayOfMonth: 0, month: components.month, year: components.year });
    }

    startOfWeek(components: TimeComponents): TimeComponents {
        return this.addDays(components, -this.startOfWeekDelta(components));
    }

    protected endOfWeekDelta(components: TimeComponents): number {
        return (components.dayOfWeek < this.firstWeekday ? -this.daysInWeek : 0) + this.daysInWeek - 1 - (components.dayOfWeek - this.firstWeekday);
    }

    protected resolvePartialComponents(components: Partial<TimeComponents>): TimeComponents {
        return this.timeToComponents(this.componentsToTime(components));
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

    protected startOfWeekDelta(components: TimeComponents): number {
        return (components.dayOfWeek < this.firstWeekday ? this.daysInWeek : 0) + components.dayOfWeek - this.firstWeekday;
    }

}
