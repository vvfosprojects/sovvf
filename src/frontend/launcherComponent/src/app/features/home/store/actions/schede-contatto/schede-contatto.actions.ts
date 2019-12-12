import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';
import { ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { RangeSchedeContattoEnum } from '../../../../../shared/enum/range-schede-contatto';

export class SetContatoriSchedeContatto {
    static readonly type = '[SchedeContatto] Set Contatori Schede Contatto';

    constructor(public contatori: ContatoriSchedeContatto) {
    }
}

export class GetListaSchedeContatto {
    static readonly type = '[SchedeContatto] Get Lista Schede Contatto';
}

export class SetListaSchedeContatto {
    static readonly type = '[SchedeContatto] Set Lista Schede Contatto';

    constructor(public schedeContatto: SchedaContatto[]) {
    }
}

export class ClearListaSchedeContatto {
    static readonly type = '[SchedeContatto] Clear Lista Schede Contatto';
}

export class UpdateSchedaContatto {
    static readonly type = '[SchedeContatto] Update Scheda Contatto';

    constructor(public schedaContatto: SchedaContatto) {
    }
}

export class SetSchedaContattoGestita {
    static readonly type = '[SchedeContatto] Set Scheda Contatto Gestita';

    constructor(public codiceScheda: string, public gestita: boolean) {
    }
}

export class SetSchedaContattoTelefonata {
    static readonly type = '[SchedeContatto] Set Scheda Contatto Telefonata';

    constructor(public schedaContatto: SchedaContatto) {
    }
}

export class ClearSchedaContattoTelefonata {
    static readonly type = '[SchedeContatto] Clear Scheda Contatto Telefonata';
}

export class SetSchedaContattoHover {
    static readonly type = '[SchedeContatto] Set Scheda Contatto Hover';

    constructor(public codiceSchedaContatto: string) {
    }
}

export class ClearSchedaContattoHover {
    static readonly type = '[SchedeContatto] Clear Scheda Contatto Hover';
}

export class ReducerSetFiltroSchedeContatto {
    static readonly type = '[SchedeContatto] Reducer Set Filtro Schede Contatto';

    constructor(public filtro: VoceFiltro) {
    }
}

export class SetFiltroKeySchedeContatto {
    static readonly type = '[SchedeContatto] Set Filtro Key Schede Contatto';

    constructor(public key: string) {
    }
}

export class SetFiltroLettaSchedeContatto {
    static readonly type = '[SchedeContatto] Set Filtro Letta Schede Contatto';

    constructor(public letta: boolean) {
    }
}

export class SetFiltroGestitaSchedeContatto {
    static readonly type = '[SchedeContatto] Set Filtro Gestita Schede Contatto';

    constructor(public gestita: boolean) {
    }
}

export class ClearFiltriSchedeContatto {
    static readonly type = '[SchedeContatto] Clear Filtri Schede Contatto';
}

export class SetFiltroSelezionatoSchedaContatto {
    static readonly type = '[SchedeContatto] Toggle filtro';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ResetFiltriSelezionatiSchedeContatto {
    static readonly type = '[SchedeContatto] Reset dei filtri selezionati';
}

export class SetRangeVisualizzazioneSchedeContatto {
    static readonly type = '[SchedeContatto]Set Range Visualizzazione Schede Contatto';

    constructor(public range: RangeSchedeContattoEnum) {
    }
}
