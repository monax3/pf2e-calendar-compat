export default foundry.utils.mergeObject({
    name: "PF2E.WorldClock.DateTheme.AR",
    era: 'PF2E.WorldClock.AR.Era',
    description: "Absalom Reckoning takes its origin from the moment the god Aroden lifted the Starstone from the depths of the Inner Sea and founded the city of Absalom, an event dated to 1 Abadius, 1 AR. This event also ushered in the Age of Enthronement in which human nations began to be founded in the Inner Sea region inspired by Aroden's example.",
    gregorianOffset: 2700,
    months: {
        values: [
            { name: 'PF2E.WorldClock.AR.Months.January', ordinal: 1, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.February', ordinal: 2, days: 28, leapDays: 29 },
            { name: 'PF2E.WorldClock.AR.Months.March', ordinal: 3, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.April', ordinal: 4, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.May', ordinal: 5, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.June', ordinal: 6, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.July', ordinal: 7, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.August', ordinal: 8, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.September', ordinal: 9, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.October', ordinal: 10, days: 31 },
            { name: 'PF2E.WorldClock.AR.Months.November', ordinal: 11, days: 30 },
            { name: 'PF2E.WorldClock.AR.Months.December', ordinal: 12, days: 31 },
        ]
    },
    days: {
        values: [
            { name: 'PF2E.WorldClock.AR.Weekdays.Monday', ordinal: 1 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Tuesday', ordinal: 2 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Wednesday', ordinal: 3 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Thursday', ordinal: 4 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Friday', ordinal: 5 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Saturday', ordinal: 6 },
            { name: 'PF2E.WorldClock.AR.Weekdays.Sunday', ordinal: 7, isRestDay: true }
        ],
    },
}, foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG);
