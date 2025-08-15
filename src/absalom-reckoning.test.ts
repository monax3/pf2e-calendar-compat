/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable unicorn/no-array-reduce, @typescript-eslint/no-unsafe-return */

import assert from 'node:assert';
import { before, describe, it } from 'node:test';

import type { GamePF2e } from 'foundry-pf2e';
import type {
    ArrayField,
    ModelPropsFromSchema,
    NumberField,
    SchemaField,
    StringField,
} from 'foundry-pf2e/foundry/common/data/fields.mjs';
import { clone, mergeDeep } from 'remeda';

// import EN from '../../../foundry-pf2e/en.json' with { type: 'json' };
import EN from '../../forks/pf2e/static/lang/en.json' with { type: 'json' };

import type { Formatter, TimeComponents } from './formatting/_types';

const worldClock = mergeDeep({
    AD: { yearOffset: -95 },
    AR: { yearOffset: 2700 },
    CE: { yearOffset: 0 },
    IC: { yearOffset: 5200 },
}, EN.PF2E.WorldClock);

function format(stringId: string, data: Record<string, string> = {}): string {
    let str = localize(stringId);
    const fmt = /{[^}]+}/g;
    str = str.replaceAll(fmt, (k) => {
        return data[k.slice(1, -1)]!;
    });
    return str;
}

function localize(id: string): string {
    return id.split('.').reduce((acc: any, i: string) => {
        return acc === undefined ? undefined : acc[i];
    }, EN) ?? id;
}

const mockGame = (): DeepPartial<typeof game> => ({
    i18n: { format, localize },
    pf2e: {
        settings: {
            worldClock: {
                dateTheme: 'AR',
                playersCanView: true,
                showClockButton: true,
                syncDarkness: false,
                timeConvention: 24,
                worldCreatedOn: '2015-01-01T00:00:00.000Z',
            },
        },
        worldClock: { worldTime: { toJSDate: () => new Date() } },
    },
});

const SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG = {
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

abstract class CalendarData implements foundry.data.CalendarConfig {

    constructor() {
        Object.assign(this, SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG);
    }

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
            return formatterFn(this as unknown as foundry.data.CalendarData, components, options);
        }
        return formatter(this as unknown as foundry.data.CalendarData, components, options);
    }

}

declare namespace globalThis {
    let CONFIG: ConfigPF2e;
    let game: GamePF2e;
    let foundry: object;
}

globalThis.CONFIG = {
    PF2E: { worldClock },
} as any;
globalThis.game = mockGame() as unknown as GamePF2e;
globalThis.foundry = {
    data: {
        CalendarData,
        SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG,
    },
    utils: {
        deepClone: clone,
        mergeObject(original: object, other: object): object {
            return mergeDeep(original, other);
        },
    },
};

const { GregorianCalendar } = await import('./gregorian-calendar');
const { CalendarPF2e } = await import('./pf2e-calendar');
const { AbsalomReckoning } = await import('./configs');
const Formatters = await import('./formatting/formatters');
CONFIG.time = { formatters: Formatters } as any;

globalThis.game.time = new class {

    calendar = new CalendarPF2e(AbsalomReckoning as foundry.data.CalendarConfig);
    earthCalendar = new GregorianCalendar(foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG);
    worldTime = 26_387_388;

    get components(): TimeComponents {
        return this.calendar.timeToComponents(this.worldTime);
    }

}() as any;

Object.assign(globalThis.game.time.calendar, AbsalomReckoning);
// Object.assign(globalThis.game.time.earthCalendar, foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG);

// eslint-disable-next-line no-extend-native
Object.defineProperty(Number.prototype, 'signedString', {
    value: function signedString(this: number) {
        return (this < 0 ? '' : '+') + String(this);
    },
});

// eslint-disable-next-line no-extend-native
Object.defineProperty(Number.prototype, 'paddedString', {
    value: function signedString(this: number, digits: number) {
        return this.toString().padStart(digits, '0');
    },
});

// eslint-disable-next-line no-extend-native
Object.defineProperty(String.prototype, 'capitalize', {
    value: function capitalize(value: string) {
        if (value.length === 0) { return value; }
        return value.charAt(0).toUpperCase() + value.slice(1);
    },
});

import AR from './tests/absalom-reckoning';
AR({ assert, describe, it });
import GC from './tests/gregorian-calendar';
GC({ assert, describe, it });

// describe('test 26387388', { skip: false }, () => {
//     for (
//         const [expected, formatter, options] of [
//             ['Moonday, 2nd of Neth, 4715 AR (9:49:48)', 'system'],
//             ['11/2/4715, 9:49:48', 'intl'],
//             ['Moonday, Neth 2nd, 4715 AR at 9:49:48', 'intl', {
//                 dateStyle: 'full',
//                 timeStyle: 'full',
//                 hour12: false,
//             }],
//             ['Neth 2nd, 4715 AR at 9:49:48', 'intl', {
//                 dateStyle: 'long',
//                 timeStyle: 'full',
//                 hour12: false,
//             }],
//             ['Net/2/4715, 9:49:48', 'intl', {
//                 dateStyle: 'medium',
//                 timeStyle: 'full',
//                 hour12: false,
//             }],
//             ['11/02/4715, 9:49:48', 'intl', {
//                 dateStyle: 'short',
//                 timeStyle: 'full',
//                 hour12: false,
//             }],
//             ['Moonday, Neth 2nd, 4715 AR at 9:49', 'intl', {
//                 dateStyle: 'full',
//                 timeStyle: 'short',
//                 hour12: false,
//             }],
//             ['Neth 2nd, 4715 AR at 9:49', 'intl', {
//                 dateStyle: 'long',
//                 timeStyle: 'short',
//                 hour12: false,
//             }],
//             ['Net/2/4715, 9:49', 'intl', {
//                 dateStyle: 'medium',
//                 timeStyle: 'short',
//                 hour12: false,
//             }],
//             ['11/02/4715, 9:49', 'intl', {
//                 dateStyle: 'short',
//                 timeStyle: 'short',
//                 hour12: false,
//             }],
//             ['Moonday, Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', {
//                 dateStyle: 'full',
//                 timeStyle: 'full',
//                 hour12: true,
//             }],
//             ['Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', {
//                 dateStyle: 'long',
//                 timeStyle: 'full',
//                 hour12: true,
//             }],
//             ['Net/2/4715, 9:49:48 AM', 'intl', {
//                 dateStyle: 'medium',
//                 timeStyle: 'full',
//                 hour12: true,
//             }],
//             ['11/02/4715, 9:49:48 AM', 'intl', {
//                 dateStyle: 'short',
//                 timeStyle: 'full',
//                 hour12: true,
//             }],
//             ['Moonday, Neth 2nd, 4715 AR at 9:49 AM', 'intl', {
//                 dateStyle: 'full',
//                 timeStyle: 'short',
//                 hour12: true,
//             }],
//             ['Neth 2nd, 4715 AR at 9:49 AM', 'intl', {
//                 dateStyle: 'long',
//                 timeStyle: 'short',
//                 hour12: true,
//             }],
//             ['Net/2/4715, 9:49 AM', 'intl', {
//                 dateStyle: 'medium',
//                 timeStyle: 'short',
//                 hour12: true,
//             }],
//             ['11/02/4715, 9:49 AM', 'intl', {
//                 dateStyle: 'short',
//                 timeStyle: 'short',
//                 hour12: true,
//             }],
//         ] as const
//     ) {
//         test(expected, () => {
//             assert.strictEqual(
//                 game.time.calendar.format(
//                     game.time.calendar.timeToComponents(26387388),
//                     formatter,
//                     options,
//                 ),
//                 expected,
//             );
//         });
//     }
// });

// describe('components', { skip: false }, async () => {
//     for (
//         const [expected, components, formatter, options] of [
//             [
//                 'Fireday, Abadius 1st, -1 AR at 0:00:00',
//                 { hour: 0, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: false },
//             ],
//             [
//                 'Fireday, Abadius 1st, -1 AR at 12:00:00 AM',
//                 { hour: 0, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: true },
//             ],
//             [
//                 'Fireday, Abadius 1st, -1 AR at 12:00:00',
//                 { hour: 12, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: false },
//             ],
//             [
//                 'Fireday, Abadius 1st, -1 AR at 12:00:00 PM',
//                 { hour: 12, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: true },
//             ],
//             [
//                 'Fireday, Abadius 1st, -1 AR at 0:00:00',
//                 { day: 0, hour: 0, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: false },
//             ],
//             [
//                 'Starday, Abadius 1st, 1 AR at 0:00:00',
//                 { day: 365, hour: 0, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: false },
//             ],
//             [
//                 'Fireday, Kuthona 31st, 4704 AR at 0:00:00',
//                 { year: 4704, day: 365, hour: 0, minute: 0, second: 0 },
//                 'intl',
//                 { dateStyle: 'full', timeStyle: 'full', hour12: false },
//             ],
//         ] as const
//     ) {
//         test(`${JSON.stringify(components)} = ${expected}`, () => {
//             assert.strictEqual(
//                 game.time.calendar.format(
//                     game.time.calendar.timeToComponents(
//                         game.time.calendar.componentsToTime(components),
//                     ),
//                     formatter,
//                     options,
//                 ),
//                 expected,
//             );
//         });
//     }
// });

// await describe('blanks', { skip: false }, async () => {
//     await test('eq', () => {
//         assert.strictEqual(
//             game.time.calendar.format(game.time.worldTime, 'date'),
//             game.time.calendar.format(game.time.worldTime, 'intl', {
//                 year: 'numeric',
//                 month: 'numeric',
//                 day: 'numeric',
//             }),
//         );
//         assert.strictEqual(
//             game.time.calendar.format(game.time.worldTime, 'intl', {
//                 year: 'numeric',
//                 day: 'numeric',
//             }),
//             game.time.calendar.format(game.time.worldTime, 'intl', {
//                 year: 'numeric',
//                 month: 'numberic',
//                 day: 'numeric',
//             }),
//         );
//         assert.strictEqual(
//             game.time.calendar.format(game.time.worldTime, 'time'),
//             game.time.calendar.format(game.time.worldTime, 'intl', {
//                 hour: 'numeric',
//                 minute: '2-digit',
//                 second: '2-digit',
//             }),
//         );
//     });
// });

// describe('GregorianCalendar', async () => {
//     const { GregorianCalendar } = await import('./gregorian-calendar');
//     const gregorian = new GregorianCalendar();

//     test('zero', () => {
//         const components = {
//             year: 0,
//             day: 0,
//             month: 0,
//             dayOfMonth: 0,
//             dayOfWeek: 5,
//             hour: 0,
//             minute: 0,
//             second: 0,
//             leapYear: true,
//             season: 3,
//         };

//         assert.deepStrictEqual(gregorian.timeToComponents(0), components);
//         assert.deepStrictEqual(gregorian.componentsToTime(components), 0);
//     });

//     test('epoch', () => {
//         const components = {
//             year: 2025,
//             month: 6,
//             dayOfMonth: 29,
//             hour: 16,
//             minute: 39,
//         };

//         const seconds = gregorian.componentsToTime(components) +
//             gregorian.epoch_seconds;
//         assert.deepStrictEqual(seconds, 1753893540);
//         assert.deepStrictEqual(
//             new Date(seconds * 1000).toUTCString(),
//             'Wed, 30 Jul 2025 16:39:00 GMT',
//         );
//     });

//     test('roundtrip', () => {
//         for (let i = 0; i < 10000; i++) {
//             const seconds = Math.floor(Math.random() * 80_000_000_000);
//             assert.deepStrictEqual(
//                 gregorian.componentsToTime(gregorian.timeToComponents(seconds)),
//                 seconds,
//             );
//         }
//     });

//     for (
//         const [month, season] of [
//             [0, 3],
//             [1, 3],
//             [2, 0],
//             [3, 0],
//             [4, 0],
//             [5, 1],
//             [6, 1],
//             [7, 1],
//             [8, 2],
//             [9, 2],
//             [10, 2],
//             [11, 3],
//         ] as const
//     ) {
//         const monthName = game.time.earthCalendar.months!.values[month]!.name
//             .split('.').at(-1);
//         const seasonName = game.time.earthCalendar.seasons!.values[season]!
//             .name.split('.').at(-1);

//         test(`${monthName} is in ${seasonName}`, () => {
//             assert.strictEqual(
//                 gregorian.componentsToSeason({ month } as TimeComponents),
//                 season,
//             );
//         });
//     }
// });
