/* eslint-disable @typescript-eslint/no-floating-promises */

import type { TestContext } from './_types';

function named(group: string, describe: string): string {
    if (globalThis.window === globalThis) {
        return describe;
    } else {
        return `${group} / ${describe}`;
    }
}

function printObj(obj: Record<string, any>): string {
    return Object.entries(obj).map(([key, value]) => `${key}:${value}`)
        .join(' ');
}

export default function testAbsalomReckoning({ assert, describe, it }: TestContext): void {
    describe(named('Absalom Reckoning', 'Functionality'), function () {
        it('roundtrip', function () {
            for (let i = 0; i < 10_000; i++) {
                const seconds = Math.floor(Math.random() * 80_000_000_000);
                assert.deepStrictEqual(
                    game.time.calendar.componentsToTime(game.time.calendar.timeToComponents(seconds)),
                    seconds,
                );
            }
        });

        it('invalid options', function () {
            assert.strictEqual(
                game.time.calendar.format(game.time.worldTime, 'intl', {
                    day: 'numeric',
                    year: 'numeric',
                }),
                game.time.calendar.format(game.time.worldTime, 'intl', {
                    day: 'numeric',
                    month: 'numberic',
                    year: 'numeric',
                }),
            );
        });

        for (
            const [expected, components, formatter, options] of [
                [
                    'Fireday, Abadius 1st, -1 AR at 0:00:00',
                    { hour: 0, minute: 0, second: 0 },
                    'intl',
                    { dateStyle: 'full', hour12: false, timeStyle: 'full' },
                ],
                [
                    'Fireday, Abadius 1st, -1 AR at 12:00:00 AM',
                    { hour: 0, minute: 0, second: 0 },
                    'intl',
                    { dateStyle: 'full', hour12: true, timeStyle: 'full' },
                ],
                [
                    'Fireday, Abadius 1st, -1 AR at 12:00:00',
                    { hour: 12, minute: 0, second: 0 },
                    'intl',
                    { dateStyle: 'full', hour12: false, timeStyle: 'full' },
                ],
                [
                    'Fireday, Abadius 1st, -1 AR at 12:00:00 PM',
                    { hour: 12, minute: 0, second: 0 },
                    'intl',
                    { dateStyle: 'full', hour12: true, timeStyle: 'full' },
                ],
                [
                    'Fireday, Abadius 1st, -1 AR at 0:00:00',
                    { day: 0, hour: 0, minute: 0, second: 0 },
                    'intl',
                    { dateStyle: 'full', hour12: false, timeStyle: 'full' },
                ],
                [
                    'Starday, Abadius 1st, 1 AR at 0:00:00',
                    { day: 365, hour: 0, minute: 0, second: 0 },
                    'intl',
                    { dateStyle: 'full', hour12: false, timeStyle: 'full' },
                ],
                [
                    'Fireday, Kuthona 31st, 4704 AR at 0:00:00',
                    { day: 365, hour: 0, minute: 0, second: 0, year: 4704 },
                    'intl',
                    { dateStyle: 'full', hour12: false, timeStyle: 'full' },
                ],
            ] as const
        ) {
            it(`components ${printObj(components)}`, function () {
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

    describe(named('Absalom Reckoning', 'Formatters'), function () {
        const cases: readonly [string, string, Intl.DateTimeFormatOptions?][] = [
            ['Moonday, 2nd of Neth, 4715 AR (9:49:48)', 'system'],
            ['11/2/4715, 9:49:48', 'intl'],
            ['Moonday, Neth 2nd, 4715 AR at 9:49:48', 'intl', {
                dateStyle: 'full',
                hour12: false,
                timeStyle: 'full',
            }],
            ['Neth 2nd, 4715 AR at 9:49:48', 'intl', {
                dateStyle: 'long',
                hour12: false,
                timeStyle: 'full',
            }],
            ['Net/2/4715, 9:49:48', 'intl', {
                dateStyle: 'medium',
                hour12: false,
                timeStyle: 'full',
            }],
            ['11/02/4715, 9:49:48', 'intl', {
                dateStyle: 'short',
                hour12: false,
                timeStyle: 'full',
            }],
            ['Moonday, Neth 2nd, 4715 AR at 9:49', 'intl', {
                dateStyle: 'full',
                hour12: false,
                timeStyle: 'short',
            }],
            ['Neth 2nd, 4715 AR at 9:49', 'intl', {
                dateStyle: 'long',
                hour12: false,
                timeStyle: 'short',
            }],
            ['Net/2/4715, 9:49', 'intl', {
                dateStyle: 'medium',
                hour12: false,
                timeStyle: 'short',
            }],
            ['11/02/4715, 9:49', 'intl', {
                dateStyle: 'short',
                hour12: false,
                timeStyle: 'short',
            }],
            ['Moonday, Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', {
                dateStyle: 'full',
                hour12: true,
                timeStyle: 'full',
            }],
            ['Neth 2nd, 4715 AR at 9:49:48 AM', 'intl', {
                dateStyle: 'long',
                hour12: true,
                timeStyle: 'full',
            }],
            ['Net/2/4715, 9:49:48 AM', 'intl', {
                dateStyle: 'medium',
                hour12: true,
                timeStyle: 'full',
            }],
            ['11/02/4715, 9:49:48 AM', 'intl', {
                dateStyle: 'short',
                hour12: true,
                timeStyle: 'full',
            }],
            ['Moonday, Neth 2nd, 4715 AR at 9:49 AM', 'intl', {
                dateStyle: 'full',
                hour12: true,
                timeStyle: 'short',
            }],
            ['Neth 2nd, 4715 AR at 9:49 AM', 'intl', {
                dateStyle: 'long',
                hour12: true,
                timeStyle: 'short',
            }],
            ['Net/2/4715, 9:49 AM', 'intl', {
                dateStyle: 'medium',
                hour12: true,
                timeStyle: 'short',
            }],
            ['11/02/4715, 9:49 AM', 'intl', {
                dateStyle: 'short',
                hour12: true,
                timeStyle: 'short',
            }],
        ] as const;
        for (const [expected, formatter, options] of cases) {
            const expected_: string = expected;
            const seconds = 26_387_388;
            it(`format to ${expected}`, function () {
                assert.strictEqual(
                    game.time.calendar.format(
                        game.time.calendar.timeToComponents(seconds),
                        formatter,
                        options,
                    ),
                    expected_,
                );
            });
        }

        it('time only', function () {
            assert.strictEqual(
                game.time.calendar.format(game.time.worldTime, 'date'),
                game.time.calendar.format(game.time.worldTime, 'intl', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                }),
            );
        });

        it('date only', function () {
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
}
