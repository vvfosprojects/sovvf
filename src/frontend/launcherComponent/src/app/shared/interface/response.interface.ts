import { PaginationInterface } from './pagination.interface';
import { Utente } from '../model/utente.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';

export interface ResponseInterface {
    dataArray?: any[];
    sintesiRichiesta?: SintesiRichiesta[];
    pagination?: PaginationInterface;
}
