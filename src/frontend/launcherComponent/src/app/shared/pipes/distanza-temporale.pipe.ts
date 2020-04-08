import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'distanzaTemporale'
})
export class DistanzaTemporalePipe implements PipeTransform {

    transform(dataDa: Date, dataA: Date, formatoSintetico: string): string {
        let ritorno = '';
        let dataIniziale, dataFinale: Date;
        let ore, minuti, secondi, millisecondi: number;
        if ((!dataDa) || (!dataA)) {
            return '';
        }

        if (new Date(dataDa).getTime() === new Date(dataA).getTime()) {
            return '';
        }
        moment.locale('it');

        if (formatoSintetico === 'S') {
            if (dataDa > dataA) {
                dataIniziale = dataDa;
                dataFinale = dataA;
                ritorno = '(+';
            } else {
                dataIniziale = dataA;
                dataFinale = dataDa;
                ritorno = `(-`;
            }

            // ritorno = ritorno + moment(dataDa).diff(dataA, 'hours', true);
            ore = moment(dataIniziale).diff(dataFinale, 'hours');
            if (ore) {
                ritorno += ore + 'h';
                dataIniziale = moment(dataIniziale).subtract(ore, 'hours').toDate();
            }
            minuti = moment(dataIniziale).diff(dataFinale, 'minutes');
            if (minuti) {
                ritorno += minuti + 'm';
                dataIniziale = moment(dataIniziale).subtract(minuti, 'minutes').toDate();
            }
            secondi = moment(dataIniziale).diff(dataFinale, 'seconds');
            if (secondi) {
                ritorno += secondi + 's';
            }
            millisecondi = moment(dataIniziale).diff(dataFinale, 'milliseconds');
            if ((!ore || !minuti) && !secondi && millisecondi > 100) {
                ritorno += millisecondi + 'ms';
            } else if (!ore && !minuti && !secondi) {
                return '';
            }
            // ritorno = ritorno + moment(dataDa).diff(dataA);
            // ritorno = ritorno + ore +"h" +  minuti +"m" + secondi +"s" ;
            ritorno = ritorno + ')';
        } else {
            ritorno = moment(dataDa).from(dataA);
        }
        // return moment(dataDa).format("HH:mm:ss");
        return ' ' + ritorno;
    }
}
