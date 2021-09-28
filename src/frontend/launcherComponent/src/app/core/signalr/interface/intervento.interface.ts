import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

export interface InterventoInterface {
    idUtente: string;
    idRichiesta: string;
    codSede: string;
    chiamata?: SintesiRichiesta;
    richiesta?: SintesiRichiesta;
}
