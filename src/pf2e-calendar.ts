import type { TimeComponents } from "./formatting/_types";
import { GregorianCalendar } from "./gregorian-calendar";

type CalendarDataSchemaPF2e = foundry.data.CalendarDataSchema & {
    abbreviation: foundry.data.fields.StringField;
    gregorianOffset: foundry.data.fields.NumberField;
}

export class CalendarPF2e extends GregorianCalendar {
    static override defineSchema(): CalendarDataSchemaPF2e {
        const schema = super.defineSchema() as CalendarDataSchemaPF2e;
        schema.abbreviation = new foundry.data.fields.StringField();
        schema.gregorianOffset = new foundry.data.fields.NumberField();
        return schema;
    }

    #worldCreatedOn?: Date = undefined;

    get worldCreatedOn(): Date {
        if (this.#worldCreatedOn === undefined) {
            this.#worldCreatedOn = new Date(Date.parse(game.pf2e.settings.worldClock.worldCreatedOn!));
        }

        return this.#worldCreatedOn;
    }

    override get epoch_seconds(): number {
        return this.worldCreatedOn.getTime() / 1000;
    }

    protected componentsToGregorian(components: TimeComponents): TimeComponents {
        const year = this.gregorianOffset
            ? components.year - this.gregorianOffset
            : components.year;
    
        return { ...components, year }
    }

    protected componentsFromGregorian(components: TimeComponents): TimeComponents {
        const year = this.gregorianOffset
            ? components.year + this.gregorianOffset
            : components.year;
    
        return { ...components, year }
    }

    override isLeapYear(year: number): boolean {
        const gregorianYear = this.gregorianOffset
            ? year - this.gregorianOffset
            : year;
    
        return super.isLeapYear(gregorianYear);
    }

    protected override componentsToDate(components: TimeComponents): Date {
        return super.componentsToDate(this.componentsToGregorian(components));
    }

    override timeToComponents(seconds = 0): TimeComponents {
        return this.componentsFromGregorian(super.timeToComponents(seconds)) as TimeComponents;
    }
   
    declare abbreviation?: string;
    declare gregorianOffset?: number;
}
