import { Pipe, PipeTransform } from '@angular/core';
import { getDescrizioneTipoNotifica } from '../helper/function-notifiche';
import { TipoNotifica } from '../enum/tipo-notifica.enum';

@Pipe({ name: 'tipoNotifica' })

export class TipoNotificaPipe implements PipeTransform {
    transform(value: TipoNotifica): string {
        return getDescrizioneTipoNotifica(value);
    }
}
