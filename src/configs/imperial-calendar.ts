export default foundry.utils.mergeObject(foundry.utils.deepClone(foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG),
    {
        name: 'PF2E.WorldClock.DateTheme.IC',
        description: 'Imperial Calendar', // FIXME
        era: 'PF2E.WorldClock.IC.Era',
        gregorianOffset: 5200,
    });
