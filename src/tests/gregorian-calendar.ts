import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';

import type { GregorianCalendar } from '../gregorian-calendar';

import type { TestContext } from './_types';

function named(group: string, describe: string): string {
    if (globalThis.window === globalThis) {
        return describe;
    } else {
        return `${group} / ${describe}`;
    }
}

export default function testGregorianCalendar({ assert, describe, it }: TestContext): void {
    describe(named('Gregorian Calendar', 'Functionality'), function () {
        it('zero', function () {
            const { earthCalendar } = game.time;

            const components = {
                day: 0,
                dayOfMonth: 0,
                dayOfWeek: 5,
                hour: 0,
                leapYear: true,
                minute: 0,
                month: 0,
                season: 3,
                second: 0,
                year: 0,
            };

            assert.deepStrictEqual(earthCalendar.timeToComponents(0), components);
            assert.deepStrictEqual(earthCalendar.componentsToTime(components), 0);
        });

        it('epoch', function () {
            const { earthCalendar } = game.time;

            const components = {
                dayOfMonth: 29,
                hour: 16,
                minute: 39,
                month: 6,
                year: 2025,
            };

            const seconds = earthCalendar.componentsToTime(components)
                + (earthCalendar as GregorianCalendar).epoch_seconds;
            assert.deepStrictEqual(seconds, 1_753_893_540);
            assert.deepStrictEqual(
                new Date(seconds * 1000).toUTCString(),
                'Wed, 30 Jul 2025 16:39:00 GMT',
            );
        });

        it('roundtrip', function () {
            const { earthCalendar } = game.time;

            for (let i = 0; i < 10_000; i++) {
                const seconds = Math.floor(Math.random() * 80_000_000_000);
                assert.deepStrictEqual(
                    earthCalendar.componentsToTime(earthCalendar.timeToComponents(seconds)),
                    seconds,
                );
            }
        });
    });

    describe(named('Gregorian Calendar', 'Seasons'), function () {
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
            const monthName = foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG.months!.values[month]!.name
                .split('.').at(-1);
            const seasonName = foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG.seasons!.values[season]!
                .name.split('.').at(-1);

            it(`${monthName} is in ${seasonName}`, function () {
                const { earthCalendar } = game.time;

                assert.strictEqual(
                    earthCalendar.timeToComponents(earthCalendar.componentsToTime({ month } as TimeComponents)).season,
                    season,
                );
            });
        }
    });
}
