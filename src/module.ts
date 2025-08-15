import type { TimeComponents } from 'foundry-pf2e/foundry/client/data/_types.mjs';
import * as AR from './absalom-reckoning';
import { formatDate, formatIntl, formatSystem, formatTime } from './format';

interface Time {
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
    config.formatters['intl'] = formatIntl;
    config.formatters['time'] = formatTime;
    config.formatters['date'] = formatDate;
    config.formatters['system'] = formatSystem;
});
