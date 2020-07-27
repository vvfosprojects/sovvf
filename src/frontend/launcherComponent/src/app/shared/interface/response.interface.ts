import { PaginationInterface } from './pagination.interface';
import { Ruolo, Utente } from '../model/utente.model';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { Sede } from '../model/sede.model';

export interface ResponseInterface {
    dataArray?: any[];
    sintesiRichiesta?: SintesiRichiesta[];
    pagination?: PaginationInterface;
    listaSediPresenti?: Ruolo[];
}
