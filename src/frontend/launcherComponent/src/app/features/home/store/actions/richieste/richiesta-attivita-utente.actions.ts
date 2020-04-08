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

export class AddPresaInCarico {
    static readonly type = '[Attivita Utente] Add Presa In Carico';

    constructor(public sintesiRichiesta: SintesiRichiesta) {
    }
}

export class DeletePresaInCarico {
    static readonly type = '[Attivita Utente] Delete Presa In Carico';

    constructor(public sintesiRichiesta: SintesiRichiesta) {
    }
}
