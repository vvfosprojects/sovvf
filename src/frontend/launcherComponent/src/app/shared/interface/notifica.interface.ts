import { TipoNotifica } from '../enum/tipo-notifica.enum';

export interface NotificaInterface {
    titolo: string;
    descrizione: string;
    tipo: TipoNotifica;
    data: string;
}
