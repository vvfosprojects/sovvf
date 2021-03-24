import { MezzoInServizio } from '../../../../../shared/interface/mezzo-in-servizio.interface';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';

export class GetListaMezziInServizio {
    static readonly type = '[MezziInServizio] Get Lista Mezzi In Servizio';

    constructor(public page?: number) {
    }
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

export class SetFiltroMezziInServizio {
    static readonly type = '[MezziInServizio] Set Filtro Mezzi In Servizio';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltriMezziInServizio {
    static readonly type = '[MezziInServizio] Clear Filtri Mezzi In Servizio';

    constructor(public preventReloadLista?: boolean) {
    }
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

export class ClearListaMezziInServizio {
    static readonly type = '[MezziInServizio] Clear Lista Mezzi In Servizio';
}

export class StartLoadingMezziInServizio {
    static readonly type = '[MezziInServizio] Start Loading Mezzi In Servizio';
}

export class StopLoadingMezziInServizio {
    static readonly type = '[MezziInServizio] Stop Loading Mezzi In Servizio';
}
