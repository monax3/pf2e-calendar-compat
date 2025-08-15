import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';
import * as AR from './absalom-reckoning';
import * as Formatters from './formatting/formatters';

export interface Time {
    earthCalendarConfig: foundry.data.CalendarConfig
    earthCalendarClass: typeof foundry.data.CalendarData

    worldCalendarConfig: foundry.data.CalendarConfig
    worldCalendarClass: typeof foundry.data.CalendarData

    formatters: Record<string, (calendar: foundry.data.CalendarConfig, components: TimeComponents, options?: Intl.DateTimeFormatOptions) => string>;
}

Hooks.on('init', () => {
    const config = CONFIG.time as unknown as Time;

    config.worldCalendarConfig = AR.CalendarConfig as foundry.data.CalendarConfig;
    config.worldCalendarClass = AR.Calendar as typeof foundry.data.CalendarData;

    for (const [name, func] of Object.entries(Formatters)) {
        config.formatters[name] = func;
    }

    // FIXME
    CONFIG.compatibility.mode = CONST.COMPATIBILITY_MODES.SILENT;
});
