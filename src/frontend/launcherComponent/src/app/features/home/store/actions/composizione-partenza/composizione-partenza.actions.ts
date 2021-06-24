import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ConfermaPartenze } from '../../../composizione-partenza/interface/conferma-partenze-interface';

export class UpdateListeComposizione {
    static readonly type = '[ComposizionePartenza] Update Liste Composizione';

    constructor(public filtri: FiltriComposizione) {
    }
}

export class ReducerFilterListeComposizione {
    static readonly type = '[ComposizionePartenza] Reducer Filter Liste Composizione';

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

    constructor(public partenze: ConfermaPartenze) {
    }
}

export class SetRichiestaComposizione {
    static readonly type = '[ComposizionePartenza] Set Richiesta Composizione';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class TerminaComposizione {
    static readonly type = '[ComposizionePartenza] Termina Composizione Partenza';
}

export class ClearPartenza {
    static readonly type = '[ComposizionePartenza] Clear Composizione Partenza';
}

export class StartListaComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Start Lista Composizione Loading';
}

export class StartListaSquadreComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Start Lista Squadre Composizione Loading';
}

export class StartListaMezziComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Start Lista Mezzi Composizione Loading';
}

export class StopListaComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Stop Lista Composizione Loading';
}

export class StopListaSquadreComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Stop Lista Squadre Composizione Loading';
}

export class StopListaMezziComposizioneLoading {
    static readonly type = '[ComposizionePartenza] Stop Lista Mezzi Composizione Loading';
}

export class StartInvioPartenzaLoading {
    static readonly type = '[ComposizionePartenza] Start Invio Partenza Loading';
}

export class StopInvioPartenzaLoading {
    static readonly type = '[ComposizionePartenza] Stop Invio Partenza Loading';
}
