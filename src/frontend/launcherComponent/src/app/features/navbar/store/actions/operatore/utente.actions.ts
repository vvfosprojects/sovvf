import { Utente } from '../../../../../shared/model/utente.model';

export class SetUtente {
    static readonly type = '[Utente] Set utente';

    constructor(public utente: Utente) {
    }
}

export class SetUtenteSignalR {
    static readonly type = '[Utente] Set utente SignalR';

    constructor(public utente: Utente) {
    }
}

export class SetUtenteLocalStorage {
    static readonly type = '[Utente] Set utente local storage';

    constructor(public utente: Utente) {
    }
}

export class SetVistaSedi {
    static readonly type = '[Utente] Set Vista Sedi Utente';

    constructor(public vistaSedi: string[]) {
    }
}

export class UpdateUtente {
    static readonly type = '[Utente] Update utente';

    constructor(public utente: Utente,
                public options?: { localStorage: boolean }) {
    }
}

export class ClearUtente {
    static readonly type = '[Utente] Clear utente';
}
