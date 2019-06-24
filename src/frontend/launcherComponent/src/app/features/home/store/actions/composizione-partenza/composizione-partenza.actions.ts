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
    static readonly type = '[FilterBarComposizione] Add Filtro Selezionato';

    constructor(public filtro: any, public tipo: string) {
    }
}

export class RemoveFiltroSelezionatoComposizione {
    static readonly type = '[FilterBarComposizione] Remove Filtro Selezionato';

    constructor(public filtro: any, public tipo: string) {
    }
}

export class ToggleComposizioneMode {
    static readonly type = '[FilterBarComposizione] Toggle Composizione Mode';
}

export class SetComposizioneMode {
    static readonly type = '[FilterBarComposizione] Set Composizione Mode';

    constructor(public compMode: Composizione) {
    }
}

export class UpdateRichiestaComposizione {
    static readonly type = '[FilterBarComposizione] Update Richiesta Composizione';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ConfirmPartenze {
    static readonly type = '[FilterBarComposizione] Confirm Partenze';

    constructor(public partenze: any) {
    }
}

export class RemoveFiltriSelezionatiComposizione {
    static readonly type = '[FilterBarComposizione] Remove Filtri Selezionati';

    constructor(public tipo: string) {
    }
}
