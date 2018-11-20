import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'friendlyDateTooltip'
})
export class FriendlyDateTooltipPipe implements PipeTransform {

    transform(date: Date): string {
        const theFormat = (navigator.language.substr(0, 2) === 'it') ? 'DD/MM/YY, HH:mm' : 'MM/DD/YY, HH:mm';

        if (!date) {
            return '';
        }

        return moment(date).format(theFormat);
    }

}
