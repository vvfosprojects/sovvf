import { Mezzo } from '../model/mezzo.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';

export interface MezzoActionInterface {
    mezzo: Mezzo;
    action?: string;
    data?: Date;
    codRichiesta?: string;
    listaMezzi?: boolean;
}
