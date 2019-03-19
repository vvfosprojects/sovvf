// Model
import {Utente} from '../../../../../shared/model/utente.model';
import { GestioneUtente } from '../../../../../shared/model/gestione-utente.model';

// SET
export class SetUtentiFiltrati {
    static readonly type = '[TebellaUtenti] Set Utenti Filtrati';

    constructor(public utentiFiltrati: GestioneUtente[]) {}
}

// SET
export class SetPageSize {
    static readonly type = '[TebellaUtenti] Set Page Size';

    constructor(public pageSize: number) {}
}

// SET
export class SetPage {
    static readonly type = '[TebellaUtenti] Set Page';

    constructor(public page: number) {}
}
