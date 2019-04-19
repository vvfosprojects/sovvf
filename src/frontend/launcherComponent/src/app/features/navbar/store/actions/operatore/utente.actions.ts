import { Utente } from '../../../../../shared/model/utente.model';

export class SetUtente {
    static readonly type = '[Utente] Set utente';

    constructor(public utente: Utente) {
    }
}

export class ClearUtente {
    static readonly type = '[Utente] Clear utente';
}
