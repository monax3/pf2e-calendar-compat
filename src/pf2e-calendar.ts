import type { TimeComponents } from 'pf2e-types/foundry/data/types';

import { GregorianCalendar } from './gregorian-calendar';

type CalendarDataSchemaPF2e = foundry.data.CalendarDataSchema & {
    era: foundry.data.fields.StringField;
    gregorianOffset: foundry.data.fields.NumberField;
};

export type CalendarConfigPF2e = foundry.data.fields.ModelPropsFromSchema<CalendarDataSchemaPF2e>;

export function isCalendarConfigPF2e(config: foundry.data.types.CalendarConfig): config is CalendarConfigPF2e {
    return 'era' in config && 'gregorianOffset' in config;
}

export class CalendarPF2e extends GregorianCalendar {

    declare readonly _source: foundry.data.fields.SourceFromSchema<CalendarDataSchemaPF2e>;
    declare era?: string;
    declare gregorianOffset?: number;

    #worldCreatedOn?: Date = undefined;

    pf2e = true;

    get eraName(): string {
        return this.era ? game.i18n.localize(this.era) : '';
    }

    get worldCreatedOn(): Date {
        if (this.#worldCreatedOn === undefined) {
            this.#worldCreatedOn = new Date(Date.parse(game.pf2e.settings.worldClock.worldCreatedOn!));
        }

        return this.#worldCreatedOn;
    }

    protected override componentsToDate(components: TimeComponents): Date {
        return super.componentsToDate(this.componentsToGregorian(components));
    }

    static override defineSchema(): CalendarDataSchemaPF2e {
        const schema = super.defineSchema() as CalendarDataSchemaPF2e;
        schema.era = new foundry.data.fields.StringField();
        schema.gregorianOffset = new foundry.data.fields.NumberField();
        return schema;
    }

    override get epoch_seconds(): number {
        return this.worldCreatedOn.getTime() / 1000;
    }

    override isLeapYear(year: number): boolean {
        const gregorianYear = this.gregorianOffset === undefined
            ? year
            : year - this.gregorianOffset;

        return super.isLeapYear(gregorianYear);
    }

    override get name(): string {
        return game.i18n.localize(this._source.name);
    }

    override set name(value: string) {
        // do nothing
    }

    override timeToComponents(seconds = 0): TimeComponents {
        return this.componentsFromGregorian(super.timeToComponents(seconds));
    }
    protected componentsFromGregorian(components: TimeComponents): TimeComponents {
        const year = this.gregorianOffset === undefined
            ? components.year
            : components.year + this.gregorianOffset;

        return { ...components, year };
    }

    protected componentsToGregorian(components: TimeComponents): TimeComponents {
        const year = this.gregorianOffset === undefined
            ? components.year
            : components.year - this.gregorianOffset;

        return { ...components, year };
    }

}
