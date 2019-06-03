import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class SetRichiestaModifica {
    static readonly type = '[RichiestaModifica] Set Richiesta Modifica';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ClearRichiestaModifica {
    static readonly type = '[RichiestaModifica] Clear Richiesta Modifica';
}

export class ModificaRilevanza {
    static readonly  type = '[RichiestaModifica] Modifica Rilevanza';
}

export class SuccessRichiestaModifica {
    static readonly  type = '[RichiestaModifica] Modifica Rilevanza Success';
}
