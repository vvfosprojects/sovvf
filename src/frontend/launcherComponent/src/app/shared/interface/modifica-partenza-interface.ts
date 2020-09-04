import { Utente } from '../model/utente.model';


export interface ModificaPartenza {
    id: string;
    nuovoMezzo: string;
    operatore: Utente;
}