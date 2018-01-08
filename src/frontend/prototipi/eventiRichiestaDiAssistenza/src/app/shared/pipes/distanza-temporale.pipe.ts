import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'distanzaTemporale'
})
export class DistanzaTemporalePipe implements PipeTransform {

transform(dataDa: Date, dataA: Date, formatoSintetico: string = "S"): string {
    let ritorno = "";
    let dataIniziale, dataFinale : Date;
    let ore, minuti, secondi : number = 0;
    if ((!dataDa) || (!dataA) )
      return "";
    if (dataDa == dataA) 
      return "...";
      moment.locale('it');

    if (formatoSintetico == "S") {
      if (dataDa > dataA) 
        { dataIniziale = dataDa;
          dataFinale = dataA;
          ritorno = "+"; }
      else
        { dataIniziale = dataA;
          dataFinale = dataDa;
          ritorno = "-"; }
      
        //ritorno = ritorno + moment(dataDa).diff(dataA, 'hours', true);
        ore = moment(dataIniziale).diff(dataFinale, 'hours');
        if (ore != 0 ) { ritorno = ritorno + ore +"h"; 
          dataIniziale = moment(dataIniziale).subtract(ore, 'hours').toDate();}
        minuti = moment(dataIniziale).diff(dataFinale, 'minutes');
        if (minuti != 0 ) { ritorno = ritorno + minuti +"m";
          dataIniziale = moment(dataIniziale).subtract(minuti, 'minutes').toDate();}
        secondi = moment(dataIniziale).diff(dataFinale, 'seconds');
        if (secondi != 0 ) { ritorno = ritorno + secondi +"s";}
        //ritorno = ritorno + moment(dataDa).diff(dataA);
        //ritorno = ritorno + ore +"h" +  minuti +"m" + secondi +"s" ;
    }
    else
      { ritorno = moment(dataDa).from(dataA); }
    //return moment(dataDa).format("HH:mm:ss");
    return ritorno;
  }
}
