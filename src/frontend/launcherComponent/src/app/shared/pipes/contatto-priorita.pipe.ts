import { Pipe, PipeTransform } from '@angular/core';
import { Priorita } from '../model/sintesi-richiesta.model';

@Pipe({
  name: 'contattoPriorita'
})
export class ContattoPrioritaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      return value === Priorita.Altissima ? 'fa fa-exclamation-triangle text-danger' : 'fa fa-exclamation-circle text-muted';
  }

}
