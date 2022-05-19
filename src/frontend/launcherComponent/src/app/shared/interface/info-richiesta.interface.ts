import { Tipologia } from '../model/tipologia.model';

export interface InfoRichiesta {
    codiceRichiesta: string;
    indirizzo: string;
    tipologie?: Tipologia[];
}
