import { Utente } from '../../../../../shared/model/utente.model';

export class GetUtente {
    static readonly type = '[Utente] Get utente';

    constructor(public utente: Utente) {
    }
}

export class SetUtente {
    static readonly type = '[Utente] Set utente';

    constructor(public utente: Utente) {
    }
}
