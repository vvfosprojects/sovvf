import { Ruolo, Utente } from '../../../../../shared/model/utente.model';
import { UtenteVvfInterface } from '../../../../../shared/interface/utente-vvf.interface';

export class GetUtentiVVF {
    static readonly type = '[GestioneUtenti] Get Utenti VVF';

    constructor(public text?: string) { }
}

export class SetUtentiVVF {
    static readonly type = '[GestioneUtenti] Set Utenti VVF';

    constructor(public utenti: UtenteVvfInterface[]) { }
}

export class ClearUtentiVVF {
    static readonly type = '[GestioneUtenti] Clear Utenti VVF';
}

export class GetUtentiGestione {
    static readonly type = '[GestioneUtenti] Get List Utenti';

    constructor(public page?: number) { }
}

export class SetUtentiGestione {
    static readonly type = '[GestioneUtenti] Set List Utenti';

    constructor(public utenti: Utente[]) { }
}

export class AddUtenteGestione {
    static readonly type = '[GestioneUtenti] Add Utente Gestione';

    constructor() { }
}

export class AddRuoloUtenteGestione {
    static readonly type = '[GestioneUtenti] Add Ruolo Utente Gestione';
}

export class RemoveUtente {
    static readonly type = '[GestioneUtenti] Remove Utente';

    constructor(public id: string) { }
}

export class RemoveRuoloUtente {
    static readonly type = '[GestioneUtenti] Remove Ruolo Utente';

    constructor(public id: string, public ruolo: Ruolo) { }
}

export class ClearDataModalAddUtenteModal {
    static readonly type = '[GestioneUtenti] Clear Data Modal "AddUtenteModal"';
}
