import { StatoRichiesta } from '../enum/stato-richiesta.enum';

export interface RichiestaActionInterface {
    idRichiesta: string;
    stato: StatoRichiesta;
}