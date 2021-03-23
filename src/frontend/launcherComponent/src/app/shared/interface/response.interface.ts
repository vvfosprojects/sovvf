import { PaginationInterface } from './pagination.interface';
import { Ruolo } from '../model/utente.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';

export interface ResponseInterface {
    dataArray?: any[];
    count?: number;
    sintesiRichiesta?: SintesiRichiesta[];
    pagination?: PaginationInterface;
    listaSediPresenti?: Ruolo[];
}
