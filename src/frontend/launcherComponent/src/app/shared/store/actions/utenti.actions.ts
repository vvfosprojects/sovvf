// Model
import { Utente } from '../../model/utente.model';

// GET
export class GetUtenti {
    static readonly type = '[Utenti] Get lista utenti';
}

// SET
export class SetUtenti {
    static readonly type = '[Utenti] Set lista utenti';

    constructor(public utenti: Utente[]) {
    }
}
