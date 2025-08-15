import type { TimeComponents } from "foundry-pf2e/foundry/client/data/_types.mjs";
import type { Formatter } from "../src/formatting/_types";
import type { DataModelConstructionContext, DataModelUpdateOptions, DataModelValidationOptions } from "foundry-pf2e/foundry/common/abstract/_types.mjs";

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

export abstract class CalendarData implements foundry.data.CalendarConfig {
    get mock(): foundry.data.CalendarData {
        return this as unknown as foundry.data.CalendarData;
    }

    constructor() {
        Object.assign(this, SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG);
    }

    abstract days: foundry.data.fields.ModelPropsFromSchema<
        {
            daysPerYear: foundry.data.fields.NumberField<number, number, true, false, false>;
            hoursPerDay: foundry.data.fields.NumberField<number, number, true, false, false>;
            minutesPerHour: foundry.data.fields.NumberField<number, number, true, false, false>;
            secondsPerMinute: foundry.data.fields.NumberField<number, number, true, false, false>;
            values: foundry.data.fields.ArrayField<
                foundry.data.fields.SchemaField<
                    {
                        abbreviation: foundry.data.fields.StringField;
                        name: foundry.data.fields.StringField<string, string, true, false, false>;
                        ordinal: foundry.data.fields.NumberField<
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
        values: foundry.data.fields.ModelPropsFromSchema<
            {
                abbreviation: foundry.data.fields.StringField;
                days: foundry.data.fields.NumberField<number, number, true, false, false>;
                leapDays: foundry.data.fields.NumberField;
                name: foundry.data.fields.StringField<string, string, true, false, false>;
                ordinal: foundry.data.fields.NumberField<number, number, true, false, false>;
            }
        >[];
    };
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
    abstract years: foundry.data.fields.ModelPropsFromSchema<
        {
            firstWeekday: foundry.data.fields.NumberField<number, number, true, false, true>;
            leapYear: foundry.data.fields.SchemaField<
                {
                    leapInterval: foundry.data.fields.NumberField<
                        number,
                        number,
                        true,
                        false,
                        true
                    >;
                    leapStart: foundry.data.fields.NumberField<number, number, true, false, true>;
                }
            >;
            yearZero: foundry.data.fields.NumberField<number, number, true, false, true>;
        }
    >;
    abstract timeToComponents(time: number): TimeComponents;

    abstract name: string;
    abstract description: string;
    get config(): foundry.data.CalendarConfig {
        return this;
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
            const formatterFn = (CONFIG.time as any).formatters[formatter]
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

    abstract componentsToTime(components: TimeComponents): number;
    abstract timeToComponents(seconds?: number): TimeComponents;
    abstract isLeapYear(year: number): boolean;
    abstract add(startTime: number | TimeComponents, deltaTime: number | TimeComponents): TimeComponents;
    abstract difference(endTime: number | TimeComponents, startTime: number | TimeComponents): TimeComponents;

    abstract _source: foundry.data.fields.SourceFromSchema<foundry.data.CalendarDataSchema>;
    abstract parent: null;
    protected static _schema: undefined;
    protected abstract _configure(): void;

        static get schema(): foundry.data.fields.SchemaField<foundry.data.CalendarDataSchema> {
            return null as any;
        }
    
        /** Define the data schema for this document instance. */
        // PROJECT NOTE: this must be overloaded in an interface merge declaration
        get schema(): foundry.data.fields.SchemaField<foundry.data.CalendarDataSchema> {
            return null as any;
        }
    
        /** Is the current state of this DataModel invalid? */
        get invalid(): boolean {
            return false;
        }
    
        /** An array of validation failure instances which may have occurred when this instance was last validated. */
        get validationFailures(): {
            fields: foundry.data.validation.DataModelValidationFailure | null;
            joint: foundry.data.validation.DataModelValidationFailure | null;
        } {
            return { fields: null, joint: null };
        }

        protected abstract _initializeSource(data: object, options?: DataModelConstructionContext<null>): this["_source"];
    protected abstract _initialize(options?: Record<string, unknown>): void;

    /** Reset the state of this data instance back to mirror the contained source data, erasing any changes. */
    abstract reset(): void;
    abstract clone(data?: Record<string, unknown>, context?: DataModelConstructionContext<null>): this;
        abstract validate(options?: DataModelValidationOptions): boolean;
        abstract updateSource(changes?: Record<string, unknown>, options?: DataModelUpdateOptions): DeepPartial<this["_source"]>;
        abstract toObject(source?: boolean): this["_source"];
    abstract toJSON(): this["_source"];

}
