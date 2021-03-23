import { StatoMezzo } from '../enum/stato-mezzo.enum';

export interface EventoMezzo {
    codiceMezzo: string;
    note: string;
    ora: string;
    stato: StatoMezzo;
}
