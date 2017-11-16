import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'friendlyHour'
})
export class FriendlyHourPipe implements PipeTransform {

 transform(date: Date, stampaSecondi: boolean): string {
    if (!date)
      return "";
      
    if (stampaSecondi)
      return moment(date).format("HH:mm:ss");
    else
      return moment(date).format("HH:mm");
  }
}
