import type { CalendarConfigPF2e } from '../pf2e-calendar';

const ImperialCalendar: CalendarConfigPF2e = foundry.utils.mergeObject(foundry.utils.deepClone(foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG),
    {
        name: 'PF2E.SETTINGS.WorldClock.DateThemes.IC',
        description: 'Imperial Calendar', // FIXME
        era: 'PF2E.WorldClock.IC.Era',
        gregorianOffset: 5200,
    });

export default ImperialCalendar;
