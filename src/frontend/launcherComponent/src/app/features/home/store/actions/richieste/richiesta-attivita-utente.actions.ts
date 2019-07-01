import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class AddInLavorazione {
    static readonly type = '[Attivita Utente] Add In Lavorazione';

    constructor(public sintesiRichiesta: SintesiRichiesta) {
    }
}

export class DeleteInLavorazione {
    static readonly type = '[Attivita Utente] Delete In Lavorazione';

    constructor(public sintesiRichiesta: SintesiRichiesta) {
    }
}
