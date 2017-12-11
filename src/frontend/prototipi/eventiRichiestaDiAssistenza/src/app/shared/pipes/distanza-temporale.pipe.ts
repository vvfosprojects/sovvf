import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'distanzaTemporale'
})
export class DistanzaTemporalePipe implements PipeTransform {

 transform(dataDa: Date, dataA: Date ): string {
    if ((!dataDa) || (!dataA) )
      return "";
      
    //return moment(dataDa).format("HH:mm:ss");
    return moment(dataDa).from(dataA);
  }
}
