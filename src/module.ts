import ModuleJson from '../module.json' with { type: 'json' };
const MODULE = ModuleJson.id;

import { AbsalomReckoning } from './configs';
import * as Formatters from './formatting/formatters';
import { GregorianCalendar } from './gregorian-calendar';
import { ImprovedCalendar } from './improved-calendar';
import { CalendarPF2e, isCalendarConfigPF2e } from './pf2e-calendar';
import type { CalendarCompatModule } from './types';
import { isCalendarPF2e } from './types';

import './tests/quench';

Hooks.on('init', () => {
    CONFIG.time.worldCalendarConfig = AbsalomReckoning;
    CONFIG.time.worldCalendarClass = CalendarPF2e;
    CONFIG.time.earthCalendarClass = GregorianCalendar;

    for (const [name, func] of Object.entries(Formatters)) {
        CONFIG.time.formatters[name] = func;
    }

    const module = game.modules.get<CalendarCompatModule>(MODULE);
    if (module) {
        module.isCalendarPF2e = isCalendarPF2e;
        module.AbsalomReckoning = AbsalomReckoning;
        module.CalendarPF2e = CalendarPF2e;
        module.GregorianCalendar = GregorianCalendar;
        module.ImprovedCalendar = ImprovedCalendar;
    }

    // FIXME
    CONFIG.compatibility.mode = CONST.COMPATIBILITY_MODES.SILENT;
});

function localizeCalendarConfig(config: foundry.data.types.CalendarConfig): void {
    if (isCalendarConfigPF2e(config)) {
        config.name = game.i18n.localize(config.name);
        config.era &&= game.i18n.localize(config.era);
    }
}

Hooks.on('i18nInit', () => {
    localizeCalendarConfig(CONFIG.time.worldCalendarConfig);
});

// Hooks.on('ready', () => {
//     localizeCalendarConfig(AbsalomReckoning);

//     CONFIG.time.worldCalendarConfig = AbsalomReckoning;
//     CONFIG.time.worldCalendarClass = CalendarPF2e;
//     CONFIG.time.earthCalendarClass = GregorianCalendar;
//     game.time.initializeCalendar();

//     for (const [name, func] of Object.entries(Formatters)) {
//         CONFIG.time.formatters[name] = func;
//     }
// });
