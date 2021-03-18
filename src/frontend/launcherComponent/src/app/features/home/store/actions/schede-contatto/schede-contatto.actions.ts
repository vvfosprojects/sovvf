import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { VoceFiltro } from '../../../filterbar/filtri-richieste/voce-filtro.model';
import { ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { RangeSchedeContattoEnum } from '../../../../../shared/enum/range-schede-contatto';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';

export class SetContatoriSchedeContatto {
    static readonly type = '[Schede Contatto] Set Contatori Schede Contatto';

    constructor(public contatori: ContatoriSchedeContatto) {
    }
}

export class GetListaSchedeContatto {
    static readonly type = '[SchedeContatto] Get Lista Schede Contatto';

    constructor(public page?: number) {
    }
}

export class SetListaSchedeContatto {
    static readonly type = '[Schede Contatto] Set Lista Schede Contatto';

    constructor(public schedeContatto: SchedaContatto[]) {
    }
}

export class GeneraListaSchedeContatto {
    static readonly type = '[SchedeContatto] Genera Lista Schede Contatto';
}

export class ClearListaSchedeContatto {
    static readonly type = '[SchedeContatto] Clear Lista Schede Contatto';
}

export class UpdateSchedaContatto {
    static readonly type = '[SchedeContatto] Update Scheda Contatto';

    constructor(public schedaContatto: SchedaContatto) {
    }
}

export class InsertSchedeContatto {
    static readonly type = '[SchedeContatto] Update Scheda Contatto';

    constructor(public schedaContatto: SchedaContatto[]) {
    }
}

export class RemoveSchedeContatto {
    static readonly type = '[SchedeContatto] Remove Schede Contatto';

    constructor(public idSchedeRimosse: string[]) {
    }
}

export class SetSchedaContattoGestita {
    static readonly type = '[SchedeContatto] Set Scheda Contatto Gestita';

    constructor(public schedaContatto: SchedaContatto, public gestita: boolean) {
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

export class SaveMergeSchedeContatto {
    static readonly type = '[SchedeContatto] Save Merge Schede Contatto';

    constructor(public schedeSelezionateId: string[]) {
    }
}

export class UndoMergeSchedeContatto {
    static readonly type = '[SchedeContatto] Undo Merge Schede Contatto';

    constructor(public codiceScheda: string) {
    }
}

export class SetTabAttivo {
    static readonly type = '[SchedeContatto] Set Tab Attivo';

    constructor(public tabAttivo: ClassificazioneSchedaContatto) {
    }
}

export class SetIdVisualizzati {
    static readonly type = '[SchedeContatto] Set Id Visualizzati';
}

export class ToggleCollapsed {
    static readonly type = '[SchedeContatto] Toggle Collapsed';

    constructor(public codiceScheda: string) {
    }
}

export class OpenDetailSC {
    static readonly type = '[SchedeContatto] Open Detail';

    constructor(public codiceScheda: string) {
    }
}

export class StartLoadingSchedeContatto {
    static readonly type = '[SchedeContatto] Start Loading Schede Contatto';
}

export class StopLoadingSchedeContatto {
    static readonly type = '[SchedeContatto] Stop Loading Schede Contatto';
}
