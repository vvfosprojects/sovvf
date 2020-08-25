import { Utente } from '../model/utente.model';
import { PaginationInterface } from './pagination.interface';

export interface TrasferimentoChiamata {
    id: string;
    codRichiesta: string;
    codSedeDa: string;
    codSedeA: string[];
    operatore: Utente;
    data: string;
}

export interface AddTrasferimentoChiamata {
    codRichiesta: string;
    codSedeA: string[];
}

export interface ResponseAddTrasferimentoInterface {
    data: TrasferimentoChiamata;
    pagination: PaginationInterface;
}
