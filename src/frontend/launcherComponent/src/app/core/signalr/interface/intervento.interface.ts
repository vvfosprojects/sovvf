import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

export interface InterventoInterface {
    chiamata: SintesiRichiesta;
    idUtente: string;
    idRichiesta: string;
    codSede: string;
}
