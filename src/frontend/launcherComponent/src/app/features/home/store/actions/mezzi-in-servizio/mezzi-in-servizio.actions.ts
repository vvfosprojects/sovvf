import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';

export class GetMezziInServizio {
    static readonly type = '[MezziInServizio] Get Mezzi In Servizio';
}

export class SetMezziInServizio {
    static readonly type = '[MezziInServizio] Set Mezzi In Servizio';

    constructor(public mezzi: MezzoInServizio[]) {
    }
}

export class UpdateMezzoInServizio {
    static readonly type = '[MezziInServizio] Update Mezzo In Servizio';

    constructor(public mezzo: MezzoInServizio) {
    }
}

export class FilterMezziInServizio {
    static readonly type = '[MezziInServizio] Filter Mezzi In Servizio';
}

export class SetFiltroMezziInServizio {
    static readonly type = '[MezziInServizio] Set Filtro Mezzi In Servizio';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltriMezziInServizio {
    static readonly type = '[MezziInServizio] Clear Filtri Mezzi In Servizio';
}

export class SetMezzoInServizioHover {
    static readonly type = '[MezziInServizio] Set Mezzo In Servizio Hover';

    constructor(public idMezzo: string) {
    }
}

export class ClearMezzoInServizioHover {
    static readonly type = '[MezziInServizio] Clear Mezzo In Servizio Hover';
}

export class SetMezzoInServizioSelezionato {
    static readonly type = '[MezziInServizio] Set Mezzo In Servizio Selezionato';

    constructor(public idMezzo: string) {
    }
}

export class ClearMezzoInServizioSelezionato {
    static readonly type = '[MezziInServizio] Clear Mezzo In Servizio Selezionato';
}

export class SetRicercaMezziInServizio {
    static readonly type = '[MezziInServizio] Set Ricerca Mezzo In Servizio';

    constructor(public ricerca: string) {
    }
}

export class ClearRicercaMezziInServizio {
    static readonly type = '[MezziInServizio] Clear Ricerca Mezzo In Servizio';
}

export class StartLoadingMezziInServizio {
    static readonly type = '[MezziInServizio] Start Loading Mezzi In Servizio';
}

export class StopLoadingMezziInServizio {
    static readonly type = '[MezziInServizio] Stop Loading Mezzi In Servizio';
}
