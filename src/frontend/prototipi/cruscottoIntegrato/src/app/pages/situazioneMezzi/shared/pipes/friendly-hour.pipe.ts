import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'friendlyHour'
})
export class FriendlyHourPipe implements PipeTransform {

 transform(date: Date): string {
     return moment(date).format("HH:mm:ss");
  }
}
