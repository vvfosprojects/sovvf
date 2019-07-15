import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class SetRichiestaGestione {
    static readonly type = '[RichiestaGestione] Set Richiesta Gestione';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ClearRichiestaGestione {
    static readonly type = '[RichiestaGestione] Clear Richiesta Gestione';
}
