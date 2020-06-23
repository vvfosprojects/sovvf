import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class SetRichiestaFissata {
    static readonly type = '[RichiestaFissata] Set Richiesta Fissata';

    constructor(public idRichiesta: string, public codiceRichiesta: string) {
    }
}

export class UpdateRichiestaFissata {
    static readonly type = '[RichiestaFissata] Update Richiesta Fissata';

    constructor(public richiesa: SintesiRichiesta) {
    }
}

export class ClearRichiestaFissata {
    static readonly type = '[RichiestaFissata] Clear Richiesta Fissata';
}

export class SetEspanso {
    static readonly type = '[RichiestaFissata] Set Espanso';

    constructor(public espanso?: boolean) {
    }
}
