import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'friendlyDate'
})
export class FriendlyDatePipe implements PipeTransform {

  transform(date: Date): string {
    if (moment(date).isSame(Date.now(), 'day'))
      return "Oggi";
    else
      if (moment(date)
        .add(1, 'days')
        .isSame(Date.now(), 'day'))
        return "Ieri";
      else
        if (moment(date)
          .isSame(Date.now(), 'year'))
          return moment(date).format("DD/MM");
        else
          return moment(date).format("DD/MM/YYYY");
  }

}
