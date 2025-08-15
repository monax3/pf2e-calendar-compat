import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';

import { AbsalomReckoning } from './configs';
import * as Formatters from './formatting/formatters';
import { GregorianCalendar } from './gregorian-calendar';
import { CalendarPF2e } from './pf2e-calendar';

export interface Time {
    earthCalendarClass: typeof foundry.data.CalendarData;
    earthCalendarConfig: foundry.data.CalendarConfig;

    worldCalendarClass: typeof foundry.data.CalendarData;
    worldCalendarConfig: foundry.data.CalendarConfig;

    formatters: Record<string, (calendar: foundry.data.CalendarData, components: TimeComponents, options?: Intl.DateTimeFormatOptions) => string>;
}

Hooks.on('init', () => {
    const config = CONFIG.time as unknown as Time;

    config.worldCalendarConfig = AbsalomReckoning as foundry.data.CalendarConfig;
    config.worldCalendarClass = CalendarPF2e as typeof foundry.data.CalendarData;
    config.earthCalendarClass = GregorianCalendar as typeof foundry.data.CalendarData;

    for (const [name, func] of Object.entries(Formatters)) {
        config.formatters[name] = func;
    }

    // FIXME
    CONFIG.compatibility.mode = CONST.COMPATIBILITY_MODES.SILENT;
});

import './tests/quench';
