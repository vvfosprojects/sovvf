import { GestioneUtente } from '../../../../../shared/interface/gestione-utente.interface';

export class SetUtentiFiltrati {
    static readonly type = '[TebellaUtenti] Set Utenti Filtrati';

    constructor(public utentiFiltrati: GestioneUtente[]) {}
}

export class SetPageSize {
    static readonly type = '[TebellaUtenti] Set Page Size';

    constructor(public pageSize: number) {}
}

export class SetPage {
    static readonly type = '[TebellaUtenti] Set Page';

    constructor(public page: number) {}
}
