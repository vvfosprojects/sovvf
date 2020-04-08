import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'friendlyHour'
})
export class FriendlyHourPipe implements PipeTransform {

    transform(date: Date, stampaSecondi: boolean): string {
        if (!date) {
            return '';
        }

        const diff = moment(date).diff(new Date(), 'minutes') * -1;

        if ((diff <= 30) && (diff > 0)) {
            return diff + ' minuti fa';
        } else if (diff === 1) {
            return diff + ' minuto fa';
        } else if (diff === 0) {
            return 'Adesso';
        }

        if (stampaSecondi) {
            return moment(date).format('HH:mm:ss');
        } else {
            return moment(date).format('HH:mm');
        }
    }
}
