import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventi'
})
export class EventiPipe implements PipeTransform {

  transform(value: string, args?: any): string {

    return value.replace(/([A-Z])/g, ' $1').trim();

  }

}
