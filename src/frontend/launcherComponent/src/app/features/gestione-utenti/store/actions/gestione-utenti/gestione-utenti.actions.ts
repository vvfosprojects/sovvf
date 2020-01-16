import { GestioneUtente } from '../../../../../shared/interface/gestione-utente.interface';
import { Role } from 'src/app/shared/model/utente.model';

export class GetGestioneUtenti {
    static readonly type = '[GestioneUtenti] Get data';

    constructor() { }
}

export class SetGestioneUtenti {
    static readonly type = '[GestioneUtenti] Set data';

    constructor(public gestioneUtenti: GestioneUtente[]) { }
}

export class ChangeRoleUtente {
    static readonly type = '[GestioneUtenti] Change Role utente';

    constructor(public idUtente: string, public ruolo: Role) { }
}

export class ChangeRoleUtenteSuccess {
    static readonly type = '[GestioneUtenti] Change Role utente success';

    constructor(public idUtente: string, public ruolo: Role) { }
}

export class AddUtente {
    static readonly type = '[GestioneUtenti] Add utente';

    constructor(public nuovoUtente: GestioneUtente) { }
}

export class AddUtenteSuccess {
    static readonly type = '[GestioneUtenti] Add utente success';

    constructor(public nuovoUtente: GestioneUtente) { }
}

export class RemoveUtente {
    static readonly type = '[GestioneUtenti] Remove utente';

    constructor(public id_utente: string, public codice_sede: string) { }
}

export class RemoveUtenteSuccess {
    static readonly type = '[GestioneUtenti] Remove utente success';

    constructor(public id_utente: string, public codice_sede: string) { }
}
