import { StatoMezzo } from '../enum/stato-mezzo.enum';

export interface SequenzaValoriSelezionati {
    stato: StatoMezzo;
    time: { hour: number, minute: number };
    dataOraAggiornamento?: Date;
}