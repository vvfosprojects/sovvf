import { Injectable } from '@angular/core';
import { NumberArray, StringOrFn, TimeagoIntl } from 'ngx-timeago';

type CustomUnit = 'Ora' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
type CustomSuffix = '' | 'ago' | 'from now';

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000;
const YEAR = 31536000;

const defaultFormattter = (then: number): { value: number, unit: CustomUnit, suffix: CustomSuffix } => {
    const now = Date.now();
    const seconds = Math.round(Math.abs(now - then) / 1000);
    const suffix: CustomSuffix = seconds < MINUTE ? '' : then < now ? 'ago' : 'from now';

    const [value, unit]: [number, CustomUnit] =
        seconds < MINUTE
            ? [0, 'Ora']
            : seconds < HOUR
            ? [Math.round(seconds / MINUTE), 'minute']
            : seconds < DAY
                ? [Math.round(seconds / HOUR), 'hour']
                : seconds < WEEK
                    ? [Math.round(seconds / DAY), 'day']
                    : seconds < MONTH
                        ? [Math.round(seconds / WEEK), 'week']
                        : seconds < YEAR
                            ? [Math.round(seconds / MONTH), 'month']
                            : [Math.round(seconds / YEAR), 'year'];
    return { value, unit, suffix };
};

export abstract class TimeagoFormatter {
    abstract format(then: number): string;
}

/*
* Custom formatter per la lib Timeago.Al momento viene mostrata la label "Ora" su una segnalazione se è stata creata da meno di un minuto
* */
@Injectable()
export class TimeagoVVFFormatter extends TimeagoFormatter {

    constructor(private intl: TimeagoIntl) {
        super();
    }

    format(then: number): string {
        const { suffix, value, unit } = defaultFormattter(then);
        return this.parse(value, unit, suffix, Date.now(), then);
    }

    private parse(value: number, unit: CustomUnit, suffix: CustomSuffix, now: number, then: number): string {
        /** convert weeks to days if strings don't handle weeks */
        if (unit === 'week' && !this.intl.strings.week && !this.intl.strings.weeks) {
            const days = Math.round(Math.abs(now - then) / (1000 * 60 * 60 * 24));
            value = days;
            unit = 'day';
        }

        /** create a normalize function for given value */
        const normalize = this.normalizeFn(value, now - then, this.intl.strings.numbers);

        /** The eventual return value stored in an array so that the wordSeparator can be used */
        const dateString: string[] = [];

        /** handle prefixes */
        if (suffix === 'ago' && this.intl.strings.prefixAgo) {
            dateString.push(normalize(this.intl.strings.prefixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.prefixFromNow) {
            dateString.push(normalize(this.intl.strings.prefixFromNow));
        }

        /** Handle Main number and unit */
        const isPlural = value > 1;
        if (isPlural) {
            const stringFn: StringOrFn = this.intl.strings[unit + 's'] || this.intl.strings[unit] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        } else {
            const stringFn: StringOrFn = this.intl.strings[unit] || this.intl.strings[unit + 's'] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }

        /** Handle Suffixes */
        if (suffix === 'ago' && this.intl.strings.suffixAgo) {
            dateString.push(normalize(this.intl.strings.suffixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.suffixFromNow) {
            dateString.push(normalize(this.intl.strings.suffixFromNow));
        }

        /** join the array into a string and return it */
        const wordSeparator = typeof this.intl.strings.wordSeparator === 'string' ? this.intl.strings.wordSeparator : ' ';
        return dateString.join(wordSeparator);
    }

    /**
     * If the numbers array is present, format numbers with it,
     * otherwise just cast the number to a string and return it
     */
    private normalizeNumber(numbers: NumberArray, value: number): string {
        if (value === 0) {
            return '';
        }
        return numbers && numbers.length === 10
            ? String(value).split('')
                .map((digit: string) => digit.match(/^[0-9]$/) ? numbers[parseInt(digit, 10)] : digit)
                .join('')
            : String(value);
    }

    /**
     * Take a string or a function that takes number of days and returns a string
     * and provide a uniform API to create string parts
     */
    private normalizeFn(value: number, millisDelta: number, numbers?: NumberArray): any {
        return (stringOrFn: StringOrFn) =>
            typeof stringOrFn === 'function'
                ? stringOrFn(value, millisDelta).replace(/%d/g, this.normalizeNumber(numbers, value))
                : stringOrFn.replace(/%d/g, this.normalizeNumber(numbers, value));
    }
}
