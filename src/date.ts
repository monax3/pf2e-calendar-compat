function millisToDays(millis: number) {
    return Math.floor(millis / (1000 * 60 * 60 * 24));
}

export function getDayOfYear(date: Date): number {
        const startOfYear = new Date(date.getTime());
        startOfYear.setUTCMonth(0);
        startOfYear.setUTCDate(1);

        return /* @__PURE__ */ millisToDays(date.getTime() - startOfYear.getTime());
    }

export function getDayOfWeek(date: Date): number {
    const day = date.getUTCDay();
    return day > 0 ? day - 1 : 6;
}

let pluralRules: Intl.PluralRules;

export function ordinalString(value: number): string {
    pluralRules ??= new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    const suffix = game.i18n.localize(`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`);
    return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}
