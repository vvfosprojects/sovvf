import { PaginationInterface } from './pagination.interface';
import { Utente } from '../model/utente.model';

export interface ResponseInterface {
    dataArray?: Utente[];
    pagination?: PaginationInterface;
}
