import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { Localita } from '../../../../../shared/model/localita.model';

export class SetRichiestaModifica {
    static readonly type = '[RichiestaModifica] Set Richiesta Modifica';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ClearRichiestaModifica {
    static readonly type = '[RichiestaModifica] Clear Richiesta Modifica';
}

export class ModificaRilevanza {
    static readonly type = '[RichiestaModifica] Modifica Rilevanza';
}

export class ModificaRilevanzaStArCu {
    static readonly type = '[RichiestaModifica] Modifica Rilevanza Storica Artistica e Culturale';
}

export class ModificaIndirizzo {
    static readonly type = '[RichiestaModifica] Modifica Indirizzo';

    constructor(public nuovoIndirizzo: Localita) {
    }
}

export class PatchRichiesta {
    static readonly type = '[RichiestaModifica] Request Modifica Richiesta';

    constructor(public sintesiRichiesta?: SintesiRichiesta) {
    }
}

export class PatchEntiIntervenutiRichiesta {
    static readonly type = '[RichiestaModifica] Request Modifica Enti Intervenuti Richiesta';

    constructor(public idRichiesta: string, public codEntiIntervenuti: string[]) {
    }
}

export class SuccessRichiestaModifica {
    static readonly type = '[RichiestaModifica] Modifica Richiesta Success';

    constructor(public homeViewRequest?: boolean) {
    }
}

export class ChiudiRichiestaModifica {
    static readonly type = '[RichiestaModifica] Modifica Richiesta Chiudi';

    constructor(public homeViewRequest?: boolean) {
    }
}

export class ClearIndirizzo {
    static readonly type = '[RichiestaModifica] Clear Indirizzo';
}
