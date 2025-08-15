/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable unicorn/no-array-reduce, @typescript-eslint/no-unsafe-return */

import { before, describe, test } from 'node:test';
import type { TestContext } from 'node:test';

import type { GamePF2e } from 'foundry-pf2e';
import EN from '../../../foundry-pf2e/en.json' with { type: 'json' };
// import EN from '../../forks/pf2e/static/lang/en.json' with { type: 'json' };
import type { Formatter, TimeComponents } from './formatting/_types';
import type { ModelPropsFromSchema, NumberField, SchemaField, StringField, ArrayField } from 'foundry-pf2e/foundry/common/data/fields.mjs';

// const worldClock = R.mergeDeep({
//     AD: { yearOffset: -95 },
//     AR: { yearOffset: 2700 },
//     CE: { yearOffset: 0 },
//     IC: { yearOffset: 5200 },
// }, EN.PF2E.WorldClock);

function format(stringId: string, data: Record<string, string> = {}) {
    let str = localize(stringId);
    const fmt = /{[^}]+}/g;
    str = str.replace(fmt, k => {
        return data[k.slice(1, -1)]!;
    });
    return str;
}

function localize(id: string): string {
    return id.split('.').reduce((acc: any, i: string) => {
        return acc[i];
    }, EN) ?? id;
}

const mockGame = (): DeepPartial<typeof game> => ({

    // i18n: { format: (...args: any[]) => args, localize: (...args: any[]) => args[0] },
    i18n: { format, localize },
    pf2e: {
        settings: {
            worldClock: {
                dateTheme:
                    "AR",
                playersCanView:
                    true,
                showClockButton:
                    true,
                syncDarkness:
                    false,
                timeConvention:
                    24,
                worldCreatedOn:
                    "2015-01-01T00:00:00.000Z"
            }
        },
        worldClock: { worldTime: { toJSDate: () => new Date() } }
    },
});

abstract class CalendarData implements foundry.data.CalendarConfig {
    format(time: number | TimeComponents, formatter: string | Formatter = "timestamp", options = {}) {
        const components = typeof time === "number" ? this.timeToComponents(time) : time;
        if (typeof formatter === "string") {
            const formatterFn = (CONFIG.time as any).formatters[formatter] ?? this.constructor[formatter as keyof Function] as Formatter | undefined;
            if (!(formatterFn instanceof Function)) {
                throw new Error(`The requested formatter "${formatter}" did not resolve as a configured formatter
          function in CONFIG.time.formatters or as a named static function in the CalendarData class.`);
            }
        return formatterFn(this.config, components, options);
        }
        return formatter(this.config, components, options);
    }

    get config(): foundry.data.CalendarConfig {
        return this;
    }

    abstract timeToComponents(time: number): TimeComponents;

    abstract name: string;
    abstract description: string;
    abstract years: ModelPropsFromSchema<{ yearZero: NumberField<number, number, true, false, true>; firstWeekday: NumberField<number, number, true, false, true>; leapYear: SchemaField<{ leapStart: NumberField<number, number, true, false, true>; leapInterval: NumberField<number, number, true, false, true>; }>; }>;
    abstract months: { values: ModelPropsFromSchema<{ name: StringField<string, string, true, false, false>; abbreviation: StringField; ordinal: NumberField<number, number, true, false, false>; days: NumberField<number, number, true, false, false>; leapDays: NumberField; }>[]; } | null;
    abstract days: ModelPropsFromSchema<{ values: ArrayField<SchemaField<{ name: StringField<string, string, true, false, false>; abbreviation: StringField; ordinal: NumberField<number, number, true, false, false>; }>>; daysPerYear: NumberField<number, number, true, false, false>; hoursPerDay: NumberField<number, number, true, false, false>; minutesPerHour: NumberField<number, number, true, false, false>; secondsPerMinute: NumberField<number, number, true, false, false>; }>;
    abstract seasons: { values: { name: string; abbreviation: string | undefined; monthStart: number | null; monthEnd: number | null; dayStart: number | null; dayEnd: number | null; }[]; } | null;
}

declare namespace globalThis {
    let CONFIG: ConfigPF2e;
    let game: GamePF2e;
    let foundry: object;
}

before(async () => {
    globalThis.CONFIG = { PF2E: { worldClock: { Date: 'PF2E.WorldClock.Date' } } } as any;
    globalThis.game = mockGame() as unknown as GamePF2e;
    globalThis.foundry = { data: { CalendarData } };

    const { Calendar, CalendarConfig } = await import('./absalom-reckoning');
    const Formatters = await import('./formatting/formatters');
    CONFIG.time = { formatters: Formatters } as any;

    globalThis.game.time = new class {
        worldTime: number = 26387388;
        calendar = new Calendar();
        get components(): TimeComponents {
            return this.calendar.timeToComponents(this.worldTime);
        }
    } as any;

    Object.assign(globalThis.game.time.calendar, CalendarConfig);

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
});

await describe("test 26387388", async () => {
    for (const [expected, formatter, options] of [
        ['Moonday, 2nd of Neth, 4715 AR (9:49:48)', 'system'],
        ['11/2/4715, 9:49:48', 'intl'],
        ['Moonday, Neth 2nd, 4715 AR at 9:49:48', 'intl', { dateStyle: 'full', timeStyle: 'full', hour12: false }],
        ['Neth 2nd, 4715 AR at 9:49:48', 'intl', { dateStyle: 'long', timeStyle: 'full', hour12: false }],
        ['Net/2/4715, 9:49:48', 'intl', { dateStyle: 'medium', timeStyle: 'full', hour12: false }],
        ['11/02/4715, 9:49:48', 'intl', { dateStyle: 'short', timeStyle: 'full', hour12: false }],
        ['Moonday, Neth 2nd, 4715 AR at 9:49', 'intl', { dateStyle: 'full', timeStyle: 'short', hour12: false }],
        ['Neth 2nd, 4715 AR at 9:49', 'intl', { dateStyle: 'long', timeStyle: 'short', hour12: false }],
        ['Net/2/4715, 9:49', 'intl', { dateStyle: 'medium', timeStyle: 'short', hour12: false }],
        ['11/02/4715, 9:49', 'intl', { dateStyle: 'short', timeStyle: 'short', hour12: false }],
        ['Moonday, Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', { dateStyle: 'full', timeStyle: 'full', hour12: true  }],
        ['Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', { dateStyle: 'long', timeStyle: 'full', hour12: true  }],
        ['Net/2/4715, 9:49:48 AM', 'intl', { dateStyle: 'medium', timeStyle: 'full', hour12: true  }],
        ['11/02/4715, 9:49:48 AM', 'intl', { dateStyle: 'short', timeStyle: 'full', hour12: true  }],
        ['Moonday, Neth 2nd, 4715 AR at 9:49 AM', 'intl', { dateStyle: 'full', timeStyle: 'short', hour12: true  }],
        ['Neth 2nd, 4715 AR at 9:49 AM', 'intl', { dateStyle: 'long', timeStyle: 'short', hour12: true  }],
        ['Net/2/4715, 9:49 AM', 'intl', { dateStyle: 'medium', timeStyle: 'short', hour12: true  }],
        ['11/02/4715, 9:49 AM', 'intl', { dateStyle: 'short', timeStyle: 'short', hour12: true  }],
    ] as const) {

        await test(expected, (t: TestContext) => {
            t.assert.strictEqual(game.time.calendar.format(game.time.calendar.timeToComponents(26387388), formatter, options), expected);
        });
    }
});

await describe("components", async () => {
    for (const [expected, components, formatter, options] of [
        ['Moonday, Neth 2nd, 4715 AR at 0:00:00', { hour: 0, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: false }],
        ['Moonday, Neth 2nd, 4715 AR at 12:00:00 AM', { hour: 0, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: true }],
        ['Moonday, Neth 2nd, 4715 AR at 12:00:00', { hour: 12, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: false }],
        ['Moonday, Neth 2nd, 4715 AR at 12:00:00 PM', { hour: 12, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: true }],
        ['Oathday, Abadius 1st, 4715 AR at 0:00:00', { day: 0, hour: 0, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: false }],
        ['Fireday, Abadius 1st, 4716 AR at 0:00:00', { day: 365, hour: 0, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: false }],
        ['Fireday, Kuthona 31st, 4704 AR at 0:00:00', { year: 4704, day: 365, hour: 0, minute: 0, second: 0 }, 'intl', { dateStyle: 'full' , timeStyle: 'full', hour12: false }],
    ] as const) {

        await test(`${JSON.stringify(components)} = ${expected}`, (t: TestContext) => {
            t.assert.strictEqual(game.time.calendar.format(game.time.calendar.timeToComponents(game.time.calendar.componentsToTime(components)), formatter, options), expected);
        });
    }
});

await describe('blanks', async () => {
    await test('eq', (t: TestContext) => {
        t.assert.strictEqual(
            game.time.calendar.format(game.time.worldTime, 'date'),
            game.time.calendar.format(game.time.worldTime, 'intl', { year: 'numeric', month: 'numeric', day: 'numeric' })
        );
        t.assert.strictEqual(
            game.time.calendar.format(game.time.worldTime, 'intl', { year: 'numeric', day: 'numeric' }),
            game.time.calendar.format(game.time.worldTime, 'intl', { year: 'numeric', month: 'numberic', day: 'numeric' })
        );
        t.assert.strictEqual(
            game.time.calendar.format(game.time.worldTime, 'time'),
            game.time.calendar.format(game.time.worldTime, 'intl', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
        );
    })
});

