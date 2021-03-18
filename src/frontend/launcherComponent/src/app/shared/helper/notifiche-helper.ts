import { TipoNotifica } from '../enum/tipo-notifica.enum';

export function getDescrizioneTipoNotifica(tipo: TipoNotifica): string {
    switch (tipo) {
        case TipoNotifica.TrasferimentoChiamata:
            return 'Trasferimento Chiamata';
    }
}
