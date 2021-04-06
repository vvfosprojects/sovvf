import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';

export class GetFiltriRichieste {
    static readonly type = '[FiltriRichieste] Get Filtri Richieste';
}

export class SetFiltroSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Set Filtro Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltroSenzaEsecuzione {
    static readonly type = '[FiltriRichieste] Clear Filtro Richieste Senza Esecuzione';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltroSelezionatoRichieste {
  static readonly type = '[FiltriRichieste] Clear Filtro Richieste Selezionato';

  constructor(public filtro: VoceFiltro) {
  }
}


export class SetFiltroBoxRichieste {
    static readonly type = '[FiltriRichieste] Set Filtro Box Richieste';

    constructor(public statoRichiesta: string) {
    }
}

export class SetFiltroTipologiaSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Set Filtro Tipologia Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltroTipologiaSelezionatoRichieste {
    static readonly type = '[FiltriRichieste] Clear Filtro Tipologia Richieste Selezionato';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ApplyFiltriTipologiaSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Apply Filtri Tipologia Richieste Selezionati';
}

export class ClearFiltriTipologiaSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Clear Filtri Tipologia Richieste Selezionati';
}

export class ResetFiltriSelezionatiRichieste {
    static readonly type = '[FiltriRichieste] Reset Filtri Richieste Selezionati';

    constructor(public options?: { preventGetList: boolean }) {
    }
}

export class SetPeriodoChiuse {
    static readonly type = '[FiltriRichieste] Set Periodo Chiuse Filtri';

    constructor(public periodo: any, public tipologiaRichiesta: string) {
    }
}

export class RemovePeriodoChiuse {
    static readonly type = '[FiltriRichieste] Remove Periodo Chiuse Filtri';

    constructor(public tipologiaRichiesta?: string) {
    }
}

export class SetChiuseRichiesta {
    static readonly type = '[FiltriRichieste] Set Chiuse Richiesta';

    constructor(public chiuse: string) {
    }
}


export class RemoveChiuseRichiesta {
    static readonly type = '[FiltriRichieste] Remove Chiuse Richiesta';

    constructor(public chiuse: string) {
    }
}

export class SetFakeStatoRichiesta {
    static readonly type = '[FiltriRichieste] Set Stati Richiesta Fake';

    constructor(public zoneEmergenza: string) {
    }
}

export class RemoveFakeStatoRichiesta {
    static readonly type = '[FiltriRichieste] Remove Stati Richiesta Fake';

    constructor(public zoneEmergenza: string) {
    }
}