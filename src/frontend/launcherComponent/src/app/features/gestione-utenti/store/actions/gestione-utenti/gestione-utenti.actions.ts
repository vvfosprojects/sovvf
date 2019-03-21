import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';

export class GetGestioneUtenti {
    static readonly type = '[GestioneUtenti] Get data';

    constructor() {}
}

export class SetGestioneUtenti {
    static readonly type = '[GestioneUtenti] Set data';

    constructor(public gestioneUtenti: GestioneUtente[]) {}
}

export class AddUtente {
    static readonly type = '[GestioneUtenti] Add utente';

    constructor(public nuovoUtente: GestioneUtente) {}
}
