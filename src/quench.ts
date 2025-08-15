import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';
import { GregorianCalendar } from './gregorian-calendar';

export default function(context: any) {
       const { describe, test, assert } = context; 
	
describe('test 26387388', () => {
    for (
        const [expected, formatter, options] of [
            ['Moonday, 2nd of Neth, 4715 AR (9:49:48)', 'system'],
            ['11/2/4715, 9:49:48', 'intl'],
            ['Moonday, Neth 2nd, 4715 AR at 9:49:48', 'intl', {
                dateStyle: 'full',
                timeStyle: 'full',
                hour12: false,
            }],
            ['Neth 2nd, 4715 AR at 9:49:48', 'intl', {
                dateStyle: 'long',
                timeStyle: 'full',
                hour12: false,
            }],
            ['Net/2/4715, 9:49:48', 'intl', {
                dateStyle: 'medium',
                timeStyle: 'full',
                hour12: false,
            }],
            ['11/02/4715, 9:49:48', 'intl', {
                dateStyle: 'short',
                timeStyle: 'full',
                hour12: false,
            }],
            ['Moonday, Neth 2nd, 4715 AR at 9:49', 'intl', {
                dateStyle: 'full',
                timeStyle: 'short',
                hour12: false,
            }],
            ['Neth 2nd, 4715 AR at 9:49', 'intl', {
                dateStyle: 'long',
                timeStyle: 'short',
                hour12: false,
            }],
            ['Net/2/4715, 9:49', 'intl', {
                dateStyle: 'medium',
                timeStyle: 'short',
                hour12: false,
            }],
            ['11/02/4715, 9:49', 'intl', {
                dateStyle: 'short',
                timeStyle: 'short',
                hour12: false,
            }],
            ['Moonday, Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', {
                dateStyle: 'full',
                timeStyle: 'full',
                hour12: true,
            }],
            ['Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', {
                dateStyle: 'long',
                timeStyle: 'full',
                hour12: true,
            }],
            ['Net/2/4715, 9:49:48 AM', 'intl', {
                dateStyle: 'medium',
                timeStyle: 'full',
                hour12: true,
            }],
            ['11/02/4715, 9:49:48 AM', 'intl', {
                dateStyle: 'short',
                timeStyle: 'full',
                hour12: true,
            }],
            ['Moonday, Neth 2nd, 4715 AR at 9:49 AM', 'intl', {
                dateStyle: 'full',
                timeStyle: 'short',
                hour12: true,
            }],
            ['Neth 2nd, 4715 AR at 9:49 AM', 'intl', {
                dateStyle: 'long',
                timeStyle: 'short',
                hour12: true,
            }],
            ['Net/2/4715, 9:49 AM', 'intl', {
                dateStyle: 'medium',
                timeStyle: 'short',
                hour12: true,
            }],
            ['11/02/4715, 9:49 AM', 'intl', {
                dateStyle: 'short',
                timeStyle: 'short',
                hour12: true,
            }],
        ] as const
    ) {
        test(expected, () => {
            assert.strictEqual(
                game.time.calendar.format(
                    game.time.calendar.timeToComponents(26387388),
                    formatter,
                    options,
                ),
                expected,
            );
        });
    }
});

describe('components', () => {
    for (
        const [expected, components, formatter, options] of [
            [
                'Fireday, Abadius 1st, -1 AR at 0:00:00',
                { hour: 0, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: false },
            ],
            [
                'Fireday, Abadius 1st, -1 AR at 12:00:00 AM',
                { hour: 0, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: true },
            ],
            [
                'Fireday, Abadius 1st, -1 AR at 12:00:00',
                { hour: 12, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: false },
            ],
            [
                'Fireday, Abadius 1st, -1 AR at 12:00:00 PM',
                { hour: 12, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: true },
            ],
            [
                'Fireday, Abadius 1st, -1 AR at 0:00:00',
                { day: 0, hour: 0, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: false },
            ],
            [
                'Starday, Abadius 1st, 1 AR at 0:00:00',
                { day: 365, hour: 0, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: false },
            ],
            [
                'Fireday, Kuthona 31st, 4704 AR at 0:00:00',
                { year: 4704, day: 365, hour: 0, minute: 0, second: 0 },
                'intl',
                { dateStyle: 'full', timeStyle: 'full', hour12: false },
            ],
        ] as const
    ) {
        test(`${JSON.stringify(components)} = ${expected}`, () => {
            assert.strictEqual(
                game.time.calendar.format(
                    game.time.calendar.timeToComponents(
                        game.time.calendar.componentsToTime(components),
                    ),
                    formatter,
                    options,
                ),
                expected,
            );
        });
    }
});

describe('blanks', () => {
    test('eq', () => {
        assert.strictEqual(
            game.time.calendar.format(game.time.worldTime, 'date'),
            game.time.calendar.format(game.time.worldTime, 'intl', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }),
        );
        assert.strictEqual(
            game.time.calendar.format(game.time.worldTime, 'intl', {
                year: 'numeric',
                day: 'numeric',
            }),
            game.time.calendar.format(game.time.worldTime, 'intl', {
                year: 'numeric',
                month: 'numberic',
                day: 'numeric',
            }),
        );
        assert.strictEqual(
            game.time.calendar.format(game.time.worldTime, 'time'),
            game.time.calendar.format(game.time.worldTime, 'intl', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
            }),
        );
    });
});

describe('GregorianCalendar', () => {
    const gregorian = new GregorianCalendar();

    test('zero', () => {
        const components = {
            year: 0,
            day: 0,
            month: 0,
            dayOfMonth: 0,
            dayOfWeek: 5,
            hour: 0,
            minute: 0,
            second: 0,
            leapYear: true,
            season: 3,
        };

        assert.deepStrictEqual(gregorian.timeToComponents(0), components);
        assert.deepStrictEqual(gregorian.componentsToTime(components), 0);
    });

    test('epoch', () => {
        const components = {
            year: 2025,
            month: 6,
            dayOfMonth: 29,
            hour: 16,
            minute: 39,
        };

        const seconds = gregorian.componentsToTime(components) +
            gregorian.epoch_seconds;
        assert.deepStrictEqual(seconds, 1753893540);
        assert.deepStrictEqual(
            new Date(seconds * 1000).toUTCString(),
            'Wed, 30 Jul 2025 16:39:00 GMT',
        );
    });

    test('roundtrip', () => {
        for (let i = 0; i < 10000; i++) {
            const seconds = Math.floor(Math.random() * 80_000_000_000);
            assert.deepStrictEqual(
                gregorian.componentsToTime(gregorian.timeToComponents(seconds)),
                seconds,
            );
        }
    });

    for (
        const [month, season] of [
            [0, 3],
            [1, 3],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 1],
            [6, 1],
            [7, 1],
            [8, 2],
            [9, 2],
            [10, 2],
            [11, 3],
        ] as const
    ) {
        const monthName = gregorian.months!.values[month]!.name
            .split('.').at(-1);
        const seasonName = gregorian.seasons!.values[season]!
            .name.split('.').at(-1);

        test(`${monthName} is in ${seasonName}`, () => {
            assert.strictEqual(
                gregorian.componentsToSeason({ month } as TimeComponents),
                season,
            );
        });
    }
});
}
