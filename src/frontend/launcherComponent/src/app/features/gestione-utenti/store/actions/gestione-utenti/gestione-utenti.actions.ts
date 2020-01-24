import { GestioneUtente } from '../../../../../shared/interface/gestione-utente.interface';

export class GetUtentiGestione {
    static readonly type = '[GestioneUtenti] Get List Utenti';

    constructor() { }
}

export class SetUtentiGestione {
    static readonly type = '[GestioneUtenti] Set List Utenti';

    constructor(public utenti: GestioneUtente[]) { }
}

export class UpdateUtenteGestione {
    static readonly type = '[GestioneUtenti] Update Utente';

    constructor(public utente: GestioneUtente) { }
}

export class AddUtente {
    static readonly type = '[GestioneUtenti] Add Utente';

    constructor(public utente: GestioneUtente) { }
}

export class OpenModalRemoveUtente {
    static readonly type = '[GestioneUtenti] Open Modal Remove Utente';

    constructor(public id: string) { }
}

export class RemoveUtente {
    static readonly type = '[GestioneUtenti] Remove Utente';

    constructor(public id: string) { }
}