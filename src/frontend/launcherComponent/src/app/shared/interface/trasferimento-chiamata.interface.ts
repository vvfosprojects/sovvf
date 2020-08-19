import { Utente } from '../model/utente.model';

export interface TrasferimentoChiamata {
    id: string;
    codRichiesta: string;
    codSedeDa: string;
    codSedeA: string;
    idOperatore: string;
    data: string;
    operatore: Utente;
}

export interface AddTrasferimentoChiamata {
    codRichiesta: string;
    codSedeDa: string;
    codSedeA: string;
    idOperatore: string;
    data: string;
}

export interface DeleteTrasferimentoChiamata {
    id: string;
}
