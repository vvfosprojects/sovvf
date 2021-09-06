import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
    it: {
        weekdays: ['L', 'M', 'M', 'G', 'V', 'S', 'D'],
        months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    }
};

@Injectable()
export class CustomDatepickerI18nService extends NgbDatepickerI18n {

    i18n = 'it';

    constructor() {
        super();
    }

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES[this.i18n].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return I18N_VALUES[this.i18n].months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
