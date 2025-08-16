import type { CalendarConfigSeason, TimeComponents } from 'pf2e-types/foundry/data/types';

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

    endOfMonth(components: TimeComponents): TimeComponents {
        const month = this.months?.values[components.month];
        if (month === undefined) {
            return components;
        }

        const dayOfMonth = components.leapYear ? month.leapDays ?? month.days : month.days;
        return { ...components, dayOfMonth };
    }

    endOfWeek(components: TimeComponents): TimeComponents {
        return this.addDays(components, this.endOfWeekDelta(components));
    }

    startOfMonth(components: TimeComponents): TimeComponents {
        return { ...components, dayOfMonth: 0 };
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
