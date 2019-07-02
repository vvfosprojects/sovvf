import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class GetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Get Filtri';
}

export class SetFiltriComposizione {
    static readonly type = '[FiltriComposizione] Set Filtri';

    constructor(public filtri: any) {
    }
}

export class UpdateListe {
    static readonly type = '[FiltriComposizione] Update Liste';

    constructor(public filtri: any) {
    }
}

export class AddFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Add Filtro Selezionato';

    constructor(public filtro: any, public tipo: string) {
    }
}

export class RemoveFiltroSelezionatoComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtro Selezionato';

    constructor(public filtro: any, public tipo: string) {
    }
}

export class RemoveFiltriSelezionatiComposizione {
    static readonly type = '[FiltriComposizione] Remove Filtri Selezionati';

    constructor(public tipo: string) {
    }
}

export class ToggleComposizioneMode {
    static readonly type = '[ComposizionePartenza] Toggle Composizione Mode';
}

export class SetComposizioneMode {
    static readonly type = '[ComposizionePartenza] Set Composizione Mode';

    constructor(public compMode: Composizione) {
    }
}

export class UpdateRichiestaComposizione {
    static readonly type = '[ComposizionePartenza] Update Richiesta Composizione';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ConfirmPartenze {
    static readonly type = '[ComposizionePartenza] Conferma Partenze';

    constructor(public partenze: any) {
    }
}

export class RichiestaComposizione {
    static readonly type = '[ComposizionePartenza] Nuova Composizione Partenza';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class TerminaComposizione {
    static readonly type = '[ComposizionePartenza] Termina Composizione Partenza';
}

export class ClearPartenza {
    static readonly type = '[ComposizionePartenza] Clear Composizione Partenza';
}
