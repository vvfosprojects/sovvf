import { StatoMezzoActions } from '../enum/stato-mezzo-actions.enum';

export interface EventoMezzo {
    codiceMezzo: string;
    note: string;
    ora: string;
    stato: StatoMezzoActions;
}
