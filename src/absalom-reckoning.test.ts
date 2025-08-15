/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable unicorn/no-array-reduce, @typescript-eslint/no-unsafe-return */

import { before, describe, test } from 'node:test';
import type { TestContext } from 'node:test';

import type { GamePF2e } from 'foundry-pf2e';
import EN from 'foundry-pf2e/en.json';
import { Temporal } from 'temporal-polyfill';

import { AbsalomReckoning } from './absalom-reckoning';
import {
    endOfMonth, endOfWeek, startOfMonth, startOfWeek,
} from './utility';

const calendar = new AbsalomReckoning();

// const worldClock = R.mergeDeep({
//     AD: { yearOffset: -95 },
//     AR: { yearOffset: 2700 },
//     CE: { yearOffset: 0 },
//     IC: { yearOffset: 5200 },
// }, EN.PF2E.WorldClock);

function localize(id: string): string {
    return id.split('.').reduce((acc: any, i: string) => {
        return acc[i];
    }, EN) ?? id;
}

const mockGame = (): DeepPartial<typeof game> => ({

    // i18n: { format: (...args: any[]) => args, localize: (...args: any[]) => args[0] },
    i18n: { format: localize, localize },
    // pf2e: { worldClock: { worldTime: { toJSDate: () => new Date() } } },
});

before(() => {
    globalThis.game = mockGame() as GamePF2e;

    // (globalThis as any).CONFIG = { PF2E: { worldClock } };

    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Number.prototype, 'signedString', {
        value: function signedString(this: number) {
            return (this < 0 ? '' : '+') + String(this);
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


function getISOFields(t: any): any {
    const out: any = {};
    for (const [key, value] of Object.entries(t.getISOFields())) {
        if (key !== 'calendar') {
            out[key] = value;
        }
    }
    return out;
}

await describe('test constructors', { skip: true }, async () => {
    await test('PlainMonthDay', (t: TestContext) => {
        const day = Temporal.PlainMonthDay.from({ calendar, day: 8, month: 3 });
        t.assert.strictEqual(calendar.format(day), 'Pharast 8');
        t.assert.strictEqual(calendar.format(day, { day: '2-digit', month: '2-digit' }), '03/08');
    });

    await test('PlainYearMonth', (t: TestContext) => {
        const day = Temporal.PlainYearMonth.from({ calendar, month: 3, year: 4725 });
        t.assert.strictEqual(calendar.format(day), 'Pharast 4725');
        t.assert.strictEqual(calendar.format(day, { month: '2-digit', year: '2-digit' }), '03/25');
    });
});

await describe('test temporal calendar', { skip: true }, async () => {
    for (const date of [
        { day: 1, month: 1, year: -2000 },
        { day: 1, month: 1, year: 1 },
        { day: 1, month: 1, year: 2024 },
        { day: 31, month: 12, year: 4519 },
        { day: 31, month: 12, year: 4719 },
    ]) {
        const now = new Date();
        const nar = calendar.fromJSDate(now);
        console.error(calendar.format(nar));

        await test(`${date.year}-${date.month}-${date.day}`, (t: TestContext) => {
            // const iso = Temporal.PlainDate.from({ calendar: 'gregory', day: date.day, era: 'bce', eraYear: date.year, month: date.month });
            const iso = Temporal.PlainDate.from({ ...date, year: date.year - 2700 });
            // const ar = iso.withCalendar(calendar);
            const ar = Temporal.PlainDate.from({ ...date, calendar });
            // const ar = new Temporal.PlainDate(iso.year, iso.month, iso.day, calendar);

            t.assert.strictEqual(calendar, ar.getCalendar());

            t.assert.deepStrictEqual(getISOFields(iso), getISOFields(ar));
            t.assert.deepStrictEqual(iso.year + 2700, ar.year);

            t.assert.deepStrictEqual(ar.era, ar.year >= 1 ? 'AR' : 'BAR');
            t.assert.notEqual(ar.eraYear, iso.eraYear);
            t.assert.deepStrictEqual(ar.eraYear, Math.abs(ar.year));

            t.assert.deepStrictEqual(iso.month, ar.month);
            t.assert.deepStrictEqual(iso.monthCode, ar.monthCode);
            t.assert.deepStrictEqual(iso.day, ar.day);
            t.assert.deepStrictEqual(iso.dayOfWeek, ar.dayOfWeek);
            t.assert.deepStrictEqual(iso.dayOfYear, ar.dayOfYear);
            t.assert.deepStrictEqual(iso.weekOfYear, ar.weekOfYear);
            t.assert.deepStrictEqual(iso.yearOfWeek, ar.yearOfWeek);
            t.assert.deepStrictEqual(iso.daysInWeek, ar.daysInWeek);
            t.assert.deepStrictEqual(iso.daysInYear, ar.daysInYear);
            t.assert.deepStrictEqual(iso.daysInMonth, ar.daysInMonth);
            t.assert.deepStrictEqual(iso.monthsInYear, ar.monthsInYear);
            t.assert.deepStrictEqual(iso.inLeapYear, ar.inLeapYear);

            for (const v of [{ days: 1 }, { weeks: 1 }, { months: 1 }, { years: 1 }]) {
                t.assert.deepStrictEqual(getISOFields(iso.add(v)), getISOFields(ar.add(v)));
            }

            const js = new Date();
            js.setUTCFullYear(iso.year, iso.month - 1, iso.day);
            const jsToAR = calendar.fromJSDate(js).toPlainDate();

            t.assert.deepStrictEqual(calendar.format(jsToAR), calendar.format(ar));


            t.assert.deepStrictEqual(startOfWeek(ar).dayOfWeek, 1);
            t.assert.deepStrictEqual(endOfWeek(ar).dayOfWeek, 7);
            t.assert.deepStrictEqual(startOfMonth(ar).day, 1);
            t.assert.deepStrictEqual(endOfMonth(ar).day, ar.daysInMonth);

            console.warn(ar.toString({ calendarName: 'always' }));

            for (const k of ['numeric',
                '2-digit',
                'long',
                'narrow',
                'short',
                undefined] as const) {
                console.warn(`month format: ${k} result: ${calendar.format(ar, { month: k })}`);
            }
            for (const k of [
                'long',
                'narrow',
                'short',
                undefined,
            ] as const) {
                console.warn(`weekday format: ${k} result: ${calendar.format(ar, { weekday: k })}`);
            }
            console.warn(`format 0: ${calendar.format(ar)}`);
            console.warn(`format 1: ${calendar.format(ar, { weekday: 'long', year: 'numeric' })}`);
            console.warn(`format 2: ${calendar.format(ar, { month: 'numeric', year: 'numeric' })}`);
            console.warn(`format 3: ${calendar.format(ar, { month: 'numeric', year: '2-digit' })}`);
            console.warn(`format 4: ${calendar.format(ar, { era: 'long', month: 'numeric' })}`);
            console.warn(`format 5: ${calendar.format(ar, { era: 'long', weekday: 'long' })}`);
            console.warn(`format 6: ${calendar.format(ar, { weekday: 'long' })}`);
            console.warn(`format 7: ${calendar.format(ar, { month: 'numeric' })}`);
            console.warn(`test format : ${calendar.format(ar.toPlainDateTime('04:20:00'))}`);
            console.warn(`test format2: ${calendar.format(ar.toPlainDateTime('16:20:00'))}`);
            // console.warn(ar.toJSON());
            // console.warn(ar.toLocaleString(['en-US', 'bloobloo'], { calendar, dateStyle: 'full', dayPeriod: 'long', timeStyle: 'full' }));
            // ar.toLocaleString(undefined, { weekday: 'long' });
            // console.error(calendar.format(ar));

            // const start = T.startOfWeek(T.startOfMonth(ar));
            // const end = T.endOfWeek(T.endOfMonth(ar));

            // for (const day of T.dateInterval(start, end)) {
            //     console.warn(calendar.format(day));
            // }
            // t.assert.deepStrictEqual(iso.toLocaleString(undefined, { weekday: 'long' }), ar.toLocaleString(undefined, { weekday: 'long' }));
        });
    }
});

await describe('test temporal calendar more', { skip: true }, async () => {
    // for (const date of [
    //     { day: 1, month: 1, year: 0 },
    //     { day: 1, month: 1, year: -2700 },
    //     { day: 1, month: 1, year: -2701 },
    // ]) {
    //     await test(`${date.year}-${date.month}-${date.day}`, (t: TestContext) => t.assert.deepStrictEqual(AbsalomReckoning.fromSource(date).toSource(), date));
    // }

    for (const date of [
        // { day: 0, month: 1, year: 4524 },
        // { day: 1, month: 0, year: 4524 },
        { day: 32, month: 1, year: 4524 },
        { day: 30, month: 2, year: 4524 },
        { day: 32, month: 3, year: 4524 },
        { day: 31, month: 4, year: 4524 },
        { day: 32, month: 5, year: 4524 },
        { day: 31, month: 6, year: 4524 },
        { day: 32, month: 7, year: 4524 },
        { day: 32, month: 8, year: 4524 },
        { day: 31, month: 9, year: 4524 },
        { day: 32, month: 10, year: 4524 },
        { day: 31, month: 11, year: 4524 },
        { day: 32, month: 12, year: 4524 },
    ]) {
        await test(`${date.year}-${date.month}-${date.day}`, (t: TestContext) => {
            const ar = Temporal.PlainDate.from({ ...date, calendar });
            const { day, month, year } = ar;
            const obj = { day, month, year };
            t.assert.notDeepStrictEqual(obj, date);
        });
    }
});

await describe('test temporal 3.0', async () => {
    for (const date of [
        { day: 1, month: 1, year: -2000 },
        { day: 1, month: 1, year: 1 },
        { day: 1, month: 1, year: 2024 },
        { day: 31, month: 12, year: 4519 },
        { day: 31, month: 12, year: 4719 },
    ]) {
        const now = new Date();
        const nar = AbsalomReckoning.Date.fromJSDate(now);
        console.error(nar.toString());

        await test(`${date.year}-${date.month}-${date.day}`, (t: TestContext) => {
            // const iso = Temporal.PlainDate.from({ calendar: 'gregory', day: date.day, era: 'bce', eraYear: date.year, month: date.month });
            const iso = Temporal.PlainDate.from({ ...date, year: date.year - 2700 });
            // const ar = iso.withCalendar(calendar);
            const ar = Temporal.PlainDate.from({ ...date, calendar });
            // const ar = new Temporal.PlainDate(iso.year, iso.month, iso.day, calendar);

            t.assert.strictEqual(calendar, ar.getCalendar());

            t.assert.deepStrictEqual(getISOFields(iso), getISOFields(ar));
            t.assert.deepStrictEqual(iso.year + 2700, ar.year);

            t.assert.deepStrictEqual(ar.era, ar.year >= 1 ? 'AR' : 'BAR');
            t.assert.notEqual(ar.eraYear, iso.eraYear);
            t.assert.deepStrictEqual(ar.eraYear, Math.abs(ar.year));

            t.assert.deepStrictEqual(iso.month, ar.month);
            t.assert.deepStrictEqual(iso.monthCode, ar.monthCode);
            t.assert.deepStrictEqual(iso.day, ar.day);
            t.assert.deepStrictEqual(iso.dayOfWeek, ar.dayOfWeek);
            t.assert.deepStrictEqual(iso.dayOfYear, ar.dayOfYear);
            t.assert.deepStrictEqual(iso.weekOfYear, ar.weekOfYear);
            t.assert.deepStrictEqual(iso.yearOfWeek, ar.yearOfWeek);
            t.assert.deepStrictEqual(iso.daysInWeek, ar.daysInWeek);
            t.assert.deepStrictEqual(iso.daysInYear, ar.daysInYear);
            t.assert.deepStrictEqual(iso.daysInMonth, ar.daysInMonth);
            t.assert.deepStrictEqual(iso.monthsInYear, ar.monthsInYear);
            t.assert.deepStrictEqual(iso.inLeapYear, ar.inLeapYear);

            for (const v of [{ days: 1 }, { weeks: 1 }, { months: 1 }, { years: 1 }]) {
                t.assert.deepStrictEqual(getISOFields(iso.add(v)), getISOFields(ar.add(v)));
            }

            const js = new Date();
            js.setUTCFullYear(iso.year, iso.month - 1, iso.day);
            const jsToAR = calendar.fromJSDate(js).toPlainDate();

            t.assert.deepStrictEqual(calendar.format(jsToAR), calendar.format(ar));


            t.assert.deepStrictEqual(startOfWeek(ar).dayOfWeek, 1);
            t.assert.deepStrictEqual(endOfWeek(ar).dayOfWeek, 7);
            t.assert.deepStrictEqual(startOfMonth(ar).day, 1);
            t.assert.deepStrictEqual(endOfMonth(ar).day, ar.daysInMonth);

            console.warn(ar.toString({ calendarName: 'always' }));

            for (const k of ['numeric',
                '2-digit',
                'long',
                'narrow',
                'short',
                undefined] as const) {
                console.warn(`month format: ${k} result: ${calendar.format(ar, { month: k })}`);
            }
            for (const k of [
                'long',
                'narrow',
                'short',
                undefined,
            ] as const) {
                console.warn(`weekday format: ${k} result: ${calendar.format(ar, { weekday: k })}`);
            }
            console.warn(`format 0: ${calendar.format(ar)}`);
            console.warn(`format 1: ${calendar.format(ar, { weekday: 'long', year: 'numeric' })}`);
            console.warn(`format 2: ${calendar.format(ar, { month: 'numeric', year: 'numeric' })}`);
            console.warn(`format 3: ${calendar.format(ar, { month: 'numeric', year: '2-digit' })}`);
            console.warn(`format 4: ${calendar.format(ar, { era: 'long', month: 'numeric' })}`);
            console.warn(`format 5: ${calendar.format(ar, { era: 'long', weekday: 'long' })}`);
            console.warn(`format 6: ${calendar.format(ar, { weekday: 'long' })}`);
            console.warn(`format 7: ${calendar.format(ar, { month: 'numeric' })}`);
            console.warn(`test format : ${calendar.format(ar.toPlainDateTime('04:20:00'))}`);
            console.warn(`test format2: ${calendar.format(ar.toPlainDateTime('16:20:00'))}`);
            // console.warn(ar.toJSON());
            // console.warn(ar.toLocaleString(['en-US', 'bloobloo'], { calendar, dateStyle: 'full', dayPeriod: 'long', timeStyle: 'full' }));
            // ar.toLocaleString(undefined, { weekday: 'long' });
            // console.error(calendar.format(ar));

            // const start = T.startOfWeek(T.startOfMonth(ar));
            // const end = T.endOfWeek(T.endOfMonth(ar));

            // for (const day of T.dateInterval(start, end)) {
            //     console.warn(calendar.format(day));
            // }
            // t.assert.deepStrictEqual(iso.toLocaleString(undefined, { weekday: 'long' }), ar.toLocaleString(undefined, { weekday: 'long' }));
        });
    }
});
