import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';
import { ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { RangeSchedeContattoEnum } from '../../../../../shared/enum/range-schede-contatto';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';

export class SetContatoriSchedeContatto {
    static readonly type = '[Schede Contatto] Set Contatori Schede Contatto';

    constructor(public contatori: ContatoriSchedeContatto) {
    }
}

export class GetListaSchedeContatto {
    static readonly type = '[Schede Contatto] Get Lista Schede Contatto';
}

export class SetListaSchedeContatto {
    static readonly type = '[Schede Contatto] Set Lista Schede Contatto';

    constructor(public schedeContatto: SchedaContatto[]) {
    }
}

export class GeneraListaSchedeContatto {
    static readonly type = '[Schede Contatto] Genera Lista Schede Contatto';
}

export class ClearListaSchedeContatto {
    static readonly type = '[Schede Contatto] Clear Lista Schede Contatto';
}

export class UpdateSchedaContatto {
    static readonly type = '[Schede Contatto] Update Scheda Contatto';

    constructor(public schedaContatto: SchedaContatto) {
    }
}

export class InsertSchedeContatto {
    static readonly type = '[Schede Contatto] Update Scheda Contatto';

    constructor(public schedaContatto: SchedaContatto[]) {
    }
}

export class RemoveSchedeContatto {
    static readonly type = '[Schede Contatto] Remove Schede Contatto';

    constructor(public idSchedeRimosse: string[]) {
    }
}

export class SetSchedaContattoGestita {
    static readonly type = '[Schede Contatto] Set Scheda Contatto Gestita';

    constructor(public schedaContatto: SchedaContatto, public gestita: boolean) {
    }
}

export class SetSchedaContattoTelefonata {
    static readonly type = '[Schede Contatto] Set Scheda Contatto Telefonata';

    constructor(public schedaContatto: SchedaContatto) {
    }
}

export class ClearSchedaContattoTelefonata {
    static readonly type = '[Schede Contatto] Clear Scheda Contatto Telefonata';
}

export class SetSchedaContattoHover {
    static readonly type = '[Schede Contatto] Set Scheda Contatto Hover';

    constructor(public codiceSchedaContatto: string) {
    }
}

export class ClearSchedaContattoHover {
    static readonly type = '[Schede Contatto] Clear Scheda Contatto Hover';
}

export class ReducerSetFiltroSchedeContatto {
    static readonly type = '[Schede Contatto] Reducer Set Filtro Schede Contatto';

    constructor(public filtro: VoceFiltro) {
    }
}

export class SetFiltroKeySchedeContatto {
    static readonly type = '[Schede Contatto] Set Filtro Key Schede Contatto';

    constructor(public key: string) {
    }
}

export class SetFiltroGestitaSchedeContatto {
    static readonly type = '[Schede Contatto] Set Filtro Gestita Schede Contatto';

    constructor(public gestita: boolean) {
    }
}

export class ClearFiltriSchedeContatto {
    static readonly type = '[Schede Contatto] Clear Filtri Schede Contatto';
}

export class SetFiltroSelezionatoSchedaContatto {
    static readonly type = '[Schede Contatto] Toggle filtro';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ResetFiltriSelezionatiSchedeContatto {
    static readonly type = '[Schede Contatto] Reset dei filtri selezionati';
}

export class SetRangeVisualizzazioneSchedeContatto {
    static readonly type = '[Schede Contatto]Set Range Visualizzazione Schede Contatto';

    constructor(public range: RangeSchedeContattoEnum) {
    }
}

export class SaveMergeSchedeContatto {
    static readonly type = '[Schede Contatto] Save Merge Schede Contatto';

    constructor(public schedeSelezionateId: string[]) {
    }
}

export class UndoMergeSchedeContatto {
    static readonly type = '[Schede Contatto] Undo Merge Schede Contatto';

    constructor(public codiceScheda: string) {
    }
}

export class SetTabAttivo {
    static readonly type = '[Schede Contatto] Set Tab Attivo';

    constructor(public tabAttivo: ClassificazioneSchedaContatto) {
    }
}

export class SetIdVisualizzati {
    static readonly type = '[Schede Contatto] Set Id Visualizzati';
}

export class ToggleCollapsed {
    static readonly type = '[Schede Contatto] Toggle Collapsed';

    constructor(public codiceScheda: string) {
    }
}

export class OpenDetailSC {
    static readonly type = '[Schede Contatto] Open Detail';

    constructor(public codiceScheda: string) {
    }
}
