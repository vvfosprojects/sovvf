import { Pipe, PipeTransform } from '@angular/core';
import { Priorita } from '../model/sintesi-richiesta.model';

@Pipe({
    name: 'contattoPriorita'
})
export class ContattoPrioritaPipe implements PipeTransform {

    transform(value: any, args?: any): string {
        return value === Priorita.Altissima ? 'fas fa-exclamation-triangle text-danger' : 'fas fa-exclamation-circle';
    }

}
