import { StatoRichiestaActions } from '../enum/stato-richiesta-actions.enum';

export interface RichiestaActionInterface {
    idRichiesta: string;
    stato: StatoRichiestaActions;
    note?: string;
}
