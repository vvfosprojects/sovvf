import { Utente } from '../model/utente.model';
import { PaginationInterface } from './pagination.interface';

export interface TrasferimentoChiamata {
    id: string;
    codChiamata: string;
    sedeDa: string;
    sedeA: string;
    operatore: Utente;
    data: string;
}

export interface AddTrasferimentoChiamata {
    codChiamata: string;
    codSedeA: string;
}

export interface ResponseAddTrasferimentoInterface {
    data: TrasferimentoChiamata;
    pagination: PaginationInterface;
}
