import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';

export class GetGestioneUtenti {
    static readonly type = '[GestioneUtenti] Get data';

    constructor() {}
}

export class SetGestioneUtenti {
    static readonly type = '[GestioneUtenti] Set data';

    constructor(public gestioneUtenti: GestioneUtente[]) {}
}
