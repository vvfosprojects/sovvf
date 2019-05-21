import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class GetRichieste {
    static readonly type = '[Richieste] Get Lista Richieste';

    constructor(public idUltimaRichiesta?: string) {
    }
}

export class SetRichieste {
    static readonly type = '[Richieste] Set Lista Richieste';

    constructor(public richieste: SintesiRichiesta[]) {
    }
}

export class ClearRichieste {
    static readonly type = '[Richieste] Clear Lista Richieste';
}

export class UpdateRichiesta {
    static readonly type = '[Richieste] Modifica Richiesta';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class AddRichiesta {
    static readonly type = '[Richieste] Add Richiesta';

    constructor(public richiesta: SintesiRichiesta) {
    }
}
