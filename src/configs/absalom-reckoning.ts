export default foundry.utils.mergeObject(
    foundry.utils.deepClone(foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG),
    {
        name: 'PF2E.WorldClock.DateTheme.AR',
        description: "Absalom Reckoning takes its origin from the moment the god Aroden lifted the Starstone from the depths of the Inner Sea and founded the city of Absalom, an event dated to 1 Abadius, 1 AR. This event also ushered in the Age of Enthronement in which human nations began to be founded in the Inner Sea region inspired by Aroden's example.",
        days: {
            values: [
                { name: 'PF2E.WorldClock.AR.Weekdays.Monday', ordinal: 1 },
                { name: 'PF2E.WorldClock.AR.Weekdays.Tuesday', ordinal: 2 },
                { name: 'PF2E.WorldClock.AR.Weekdays.Wednesday', ordinal: 3 },
                { name: 'PF2E.WorldClock.AR.Weekdays.Thursday', ordinal: 4 },
                { name: 'PF2E.WorldClock.AR.Weekdays.Friday', ordinal: 5 },
                { name: 'PF2E.WorldClock.AR.Weekdays.Saturday', ordinal: 6 },
                { name: 'PF2E.WorldClock.AR.Weekdays.Sunday', isRestDay: true, ordinal: 7 },
            ],
        },
        era: 'PF2E.WorldClock.AR.Era',
        gregorianOffset: 2700,
        months: {
            values: [
                { name: 'PF2E.WorldClock.AR.Months.January', days: 31, ordinal: 1 },
                { name: 'PF2E.WorldClock.AR.Months.February', days: 28, leapDays: 29, ordinal: 2 },
                { name: 'PF2E.WorldClock.AR.Months.March', days: 31, ordinal: 3 },
                { name: 'PF2E.WorldClock.AR.Months.April', days: 30, ordinal: 4 },
                { name: 'PF2E.WorldClock.AR.Months.May', days: 31, ordinal: 5 },
                { name: 'PF2E.WorldClock.AR.Months.June', days: 30, ordinal: 6 },
                { name: 'PF2E.WorldClock.AR.Months.July', days: 31, ordinal: 7 },
                { name: 'PF2E.WorldClock.AR.Months.August', days: 31, ordinal: 8 },
                { name: 'PF2E.WorldClock.AR.Months.September', days: 30, ordinal: 9 },
                { name: 'PF2E.WorldClock.AR.Months.October', days: 31, ordinal: 10 },
                { name: 'PF2E.WorldClock.AR.Months.November', days: 30, ordinal: 11 },
                { name: 'PF2E.WorldClock.AR.Months.December', days: 31, ordinal: 12 },
            ],
        },
    },
);
