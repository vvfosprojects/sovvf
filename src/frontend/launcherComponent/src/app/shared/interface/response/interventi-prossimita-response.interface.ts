import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';

export interface InterventiProssimitaResponse {
    dataArray: SintesiRichiesta[];
    dataArrayStessaVia: SintesiRichiesta[];
    dataArrayInterventiChiusiStessoIndirizzo: SintesiRichiesta[];
}
