import type { DataModelConstructionContext, DataModelUpdateOptions, DataModelValidationOptions } from 'pf2e-types/foundry/abstract/types';
import type { CalendarData, CalendarDataSchema } from 'pf2e-types/foundry/data';
import type {
    ArrayField, ModelPropsFromSchema, NumberField, SchemaField, SourceFromSchema, StringField,
} from 'pf2e-types/foundry/data/fields';
import type { CalendarConfig, TimeComponents } from 'pf2e-types/foundry/data/types';
import type { DataModelValidationFailure } from 'pf2e-types/foundry/data/validation';

import type { Formatter } from '../src/formatting/_types';

export const SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG = {
    name: 'Simplified Gregorian',
    description:
        'The Gregorian calendar with some simplifications regarding leap years or seasonal timing.',
    days: {
        daysPerYear: 365,
        hoursPerDay: 24,
        minutesPerHour: 60,
        secondsPerMinute: 60,
        values: [
            { name: 'CALENDAR.GREGORIAN.Monday', abbreviation: 'CALENDAR.GREGORIAN.MondayAbbr', ordinal: 1 },
            { name: 'CALENDAR.GREGORIAN.Tuesday', abbreviation: 'CALENDAR.GREGORIAN.TuesdayAbbr', ordinal: 2 },
            { name: 'CALENDAR.GREGORIAN.Wednesday', abbreviation: 'CALENDAR.GREGORIAN.WednesdayAbbr', ordinal: 3 },
            { name: 'CALENDAR.GREGORIAN.Thursday', abbreviation: 'CALENDAR.GREGORIAN.ThursdayAbbr', ordinal: 4 },
            { name: 'CALENDAR.GREGORIAN.Friday', abbreviation: 'CALENDAR.GREGORIAN.FridayAbbr', ordinal: 5 },
            { name: 'CALENDAR.GREGORIAN.Saturday', abbreviation: 'CALENDAR.GREGORIAN.SaturdayAbbr', isRestDay: true, ordinal: 6 },
            { name: 'CALENDAR.GREGORIAN.Sunday', abbreviation: 'CALENDAR.GREGORIAN.SundayAbbr', isRestDay: true, ordinal: 7 },
        ],
    },
    months: {
        values: [
            { name: 'CALENDAR.GREGORIAN.January', abbreviation: 'CALENDAR.GREGORIAN.JanuaryAbbr', days: 31, ordinal: 1 },
            { name: 'CALENDAR.GREGORIAN.February', abbreviation: 'CALENDAR.GREGORIAN.FebruaryAbbr', days: 28, leapDays: 29, ordinal: 2 },
            { name: 'CALENDAR.GREGORIAN.March', abbreviation: 'CALENDAR.GREGORIAN.MarchAbbr', days: 31, ordinal: 3 },
            { name: 'CALENDAR.GREGORIAN.April', abbreviation: 'CALENDAR.GREGORIAN.AprilAbbr', days: 30, ordinal: 4 },
            { name: 'CALENDAR.GREGORIAN.May', abbreviation: 'CALENDAR.GREGORIAN.MayAbbr', days: 31, ordinal: 5 },
            { name: 'CALENDAR.GREGORIAN.June', abbreviation: 'CALENDAR.GREGORIAN.JuneAbbr', days: 30, ordinal: 6 },
            { name: 'CALENDAR.GREGORIAN.July', abbreviation: 'CALENDAR.GREGORIAN.JulyAbbr', days: 31, ordinal: 7 },
            { name: 'CALENDAR.GREGORIAN.August', abbreviation: 'CALENDAR.GREGORIAN.AugustAbbr', days: 31, ordinal: 8 },
            { name: 'CALENDAR.GREGORIAN.September', abbreviation: 'CALENDAR.GREGORIAN.SeptemberAbbr', days: 30, ordinal: 9 },
            { name: 'CALENDAR.GREGORIAN.October', abbreviation: 'CALENDAR.GREGORIAN.OctoberAbbr', days: 31, ordinal: 10 },
            { name: 'CALENDAR.GREGORIAN.November', abbreviation: 'CALENDAR.GREGORIAN.NovemberAbbr', days: 30, ordinal: 11 },
            { name: 'CALENDAR.GREGORIAN.December', abbreviation: 'CALENDAR.GREGORIAN.DecemberAbbr', days: 31, ordinal: 12 },
        ],
    },
    seasons: {
        values: [
            { name: 'CALENDAR.GREGORIAN.Spring', monthEnd: 5, monthStart: 3 },
            { name: 'CALENDAR.GREGORIAN.Summer', monthEnd: 8, monthStart: 6 },
            { name: 'CALENDAR.GREGORIAN.Fall', monthEnd: 11, monthStart: 9 },
            { name: 'CALENDAR.GREGORIAN.Winter', monthEnd: 2, monthStart: 12 },
        ],
    },
    years: {
        firstWeekday: 0,
        leapYear: {
            leapInterval: 4,
            leapStart: 8,
        },
        yearZero: 0,
    },
};

export abstract class MockCalendarData implements CalendarConfig {

    constructor() {
        Object.assign(this, SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG);
    }

    abstract _source: SourceFromSchema<CalendarDataSchema>;
    abstract days: ModelPropsFromSchema<
        {
            daysPerYear: NumberField<number, number, true, false, false>;
            hoursPerDay: NumberField<number, number, true, false, false>;
            minutesPerHour: NumberField<number, number, true, false, false>;
            secondsPerMinute: NumberField<number, number, true, false, false>;
            values: ArrayField<
                SchemaField<
                    {
                        abbreviation: StringField;
                        name: StringField<string, string, true, false, false>;
                        ordinal: NumberField<
                            number,
                            number,
                            true,
                            false,
                            false
                        >;
                    }
                >
            >;
        }
    >;
    abstract months: null | {
        values: ModelPropsFromSchema<
            {
                abbreviation: StringField;
                days: NumberField<number, number, true, false, false>;
                leapDays: NumberField;
                name: StringField<string, string, true, false, false>;
                ordinal: NumberField<number, number, true, false, false>;
            }
        >[];
    };
    abstract parent: null;
    abstract seasons: null | {
        values: {
            abbreviation: string | undefined;
            dayEnd: null | number;
            dayStart: null | number;
            monthEnd: null | number;
            monthStart: null | number;
            name: string;
        }[];
    };
    abstract years: ModelPropsFromSchema<
        {
            firstWeekday: NumberField<number, number, true, false, true>;
            leapYear: SchemaField<
                {
                    leapInterval: NumberField<
                        number,
                        number,
                        true,
                        false,
                        true
                    >;
                    leapStart: NumberField<number, number, true, false, true>;
                }
            >;
            yearZero: NumberField<number, number, true, false, true>;
        }
    >;
    protected abstract _configure(): void;
    abstract add(startTime: number | TimeComponents, deltaTime: number | TimeComponents): TimeComponents;
    abstract componentsToTime(components: TimeComponents): number;
    abstract difference(endTime: number | TimeComponents, startTime: number | TimeComponents): TimeComponents;
    abstract isLeapYear(year: number): boolean;
    abstract timeToComponents(time: number): TimeComponents;
    abstract timeToComponents(seconds?: number): TimeComponents;

    abstract name: string;
    abstract description: string;
    protected static _schema: undefined;
    get config(): CalendarConfig {
        return this;
    }
    get mock(): CalendarData {
        return this as unknown as CalendarData;
    }
    static get schema(): SchemaField<CalendarDataSchema> {
        return null as any;
    }

    format(
        time: number | TimeComponents,
        formatter: Formatter | string = 'timestamp',
        options = {},
    ): string {
        const components = typeof time === 'number'
            ? this.timeToComponents(time)
            : time;
        if (typeof formatter === 'string') {
            const formatterFn = CONFIG.time.formatters[formatter]
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                ?? this.constructor[formatter as keyof Function] as
                | Formatter
                | undefined;
            if (!(typeof formatterFn === 'function')) {
                throw new TypeError(
                    `The requested formatter "${formatter}" did not resolve as a configured formatter
          function in CONFIG.time.formatters or as a named static function in the CalendarData class.`,
                );
            }
            return formatterFn(this.mock, components, options);
        }
        return formatter(this.mock, components, options);
    }

    /** Define the data schema for this document instance. */
    // PROJECT NOTE: this must be overloaded in an interface merge declaration
    get schema(): SchemaField<CalendarDataSchema> {
        return null as any;
    }

    /** Is the current state of this DataModel invalid? */
    get invalid(): boolean {
        return false;
    }

    /** An array of validation failure instances which may have occurred when this instance was last validated. */
    protected abstract _initialize(options?: Record<string, unknown>): void;
    protected abstract _initializeSource(data: object, options?: DataModelConstructionContext<null>): this['_source'];

    get validationFailures(): {
        fields: DataModelValidationFailure | null;
        joint: DataModelValidationFailure | null;
    } {
        return { fields: null, joint: null };
    }

    /** Reset the state of this data instance back to mirror the contained source data, erasing any changes. */
    abstract clone(data?: Record<string, unknown>, context?: DataModelConstructionContext<null>): this;
    abstract reset(): void;
    abstract toJSON(): this['_source'];
    abstract toObject(source?: boolean): this['_source'];
    abstract updateSource(changes?: Record<string, unknown>, options?: DataModelUpdateOptions): DeepPartial<this['_source']>;
    abstract validate(options?: DataModelValidationOptions): boolean;

}
