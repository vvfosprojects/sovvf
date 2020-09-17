import { StatoMezzoSequenze } from '../enum/stato-mezzo.enum';

export interface SequenzaValoriSelezionati {
    stato: StatoMezzoSequenze;
    time?: { hour: number, minute: number };
    dataOraAggiornamento?: Date;
}