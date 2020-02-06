import { Ruolo } from '../model/utente.model';

export interface AddRuoloUtenteInterface {
    codFiscale: string;
    ruoli: Ruolo[];
    soloDistaccamenti: boolean;
}
