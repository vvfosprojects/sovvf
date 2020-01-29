import { Utente } from '../../../../../shared/model/utente.model';

export class GetUtentiGestione {
    static readonly type = '[GestioneUtenti] Get List Utenti';

    constructor() { }
}

export class SetUtentiGestione {
    static readonly type = '[GestioneUtenti] Set List Utenti';

    constructor(public utenti: Utente[]) { }
}

export class GetUtenteDetail {
    static readonly type = '[GestioneUtenti] Get Utente Detail';

    constructor(public id: string) { }
}

export class SetUtenteDetail {
    static readonly type = '[GestioneUtenti] Set Utente Detail';

    constructor(public utente: Utente) { }
}

export class ClearUtenteDetail {
    static readonly type = '[GestioneUtenti] Clear Utente Detail';
}

export class UpdateUtenteGestione {
    static readonly type = '[GestioneUtenti] Update Utente';

    constructor(public utente: Utente) { }
}

export class AddUtente {
    static readonly type = '[GestioneUtenti] Add Utente';

    constructor(public utente: Utente) { }
}

export class OpenModalRemoveUtente {
    static readonly type = '[GestioneUtenti] Open Modal Remove Utente';

    constructor(public id: string) { }
}

export class RemoveUtente {
    static readonly type = '[GestioneUtenti] Remove Utente';

    constructor(public id: string) { }
}