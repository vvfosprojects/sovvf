import { Ruolo, Utente } from '../../../../../shared/model/utente.model';
import { UtenteVvfInterface } from '../../../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../../../shared/interface/add-ruolo-utente.interface';

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

export class AddRuoloUtenteGestione {
    static readonly type = '[GestioneUtenti] Add Ruolo Utente Gestione';
}

export class OpenModalRemoveUtente {
    static readonly type = '[GestioneUtenti] Open Modal Remove Utente';

    constructor(public id: string, public nominativoUtente: string) { }
}

export class RemoveUtente {
    static readonly type = '[GestioneUtenti] Remove Utente';

    constructor(public id: string) { }
}

export class OpenModalRemoveRuoloUtente {
    static readonly type = '[GestioneUtenti] Open Modal Remove Ruolo Utente';

    constructor(public id: string, public ruolo: Ruolo, public nominativoUtente: string) { }
}

export class RemoveRuoloUtente {
    static readonly type = '[GestioneUtenti] Remove Utente';

    constructor(public id: string, public ruolo: Ruolo) { }
}
