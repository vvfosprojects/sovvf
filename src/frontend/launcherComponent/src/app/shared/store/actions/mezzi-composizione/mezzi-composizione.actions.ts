import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { ComposizioneFilterbar } from '../../../../features/home/composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { Mezzo } from '../../../model/mezzo.model';
import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';

export class SetListaMezziComposizione {
    static readonly type = '[MezziComposizione] Set Lista Mezzi Composizione';

    constructor(public mezziComp?: MezzoComposizione[]) {
    }
}

export class ClearListaMezziComposizione {
    static readonly type = '[MezziComposizione] Clear Lista Mezzi Composizione';
}

export class AddMezzoComposizione {
    static readonly type = '[MezziComposizione] Add Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class RemoveMezzoComposizione {
    static readonly type = '[MezziComposizione] Remove Mezzo Composizione';

    constructor(public idMezzoComp: string) {
    }
}

export class UpdateMezzoComposizione {
    static readonly type = '[MezziComposizione] Update Mezzo Composizione';

    constructor(public mezzo: Mezzo) {
    }
}

export class UpdateMezzoComposizioneScadenzaByCodiceMezzo {
    static readonly type = '[MezziComposizione] Update Mezzo Composizione Scadenza By Codice Mezzo';

    constructor(public codiceMezzo: string, public istanteScadenzaSelezione: string) {
    }
}

export class ReducerSelectMezzoComposizione {
    static readonly type = '[MezziComposizione] Reducer Select Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class ReducerSelectMezzoComposizioneInRientro {
    static readonly type = '[MezziComposizione] Reducer Select Mezzo Composizione In Rientro';

    constructor(public mezzoComp: MezzoComposizione, public noSelect?: boolean) {
    }
}

export class ReducerSelectMezzoComposizionePreAccoppiati {
    static readonly type = '[MezziComposizione] Reducer Select Mezzo Composizione Pre Accoppiati';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class SelectMezzoComposizioneFromMappa {
    static readonly type = '[MezziComposizione] Select Mezzo Composizione From Mappa';

    constructor(public mezzoId: string) {
    }
}

export class SelectMezzoComposizione {
    static readonly type = '[MezziComposizione] Select Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione, public preaccoppiato?: boolean) {
    }
}

export class UnselectMezzoComposizione {
    static readonly type = '[MezziComposizione] Unselect Mezzo Composizione';

    constructor(public preventGet?: boolean) {
    }
}

export class ClearSelectedMezziComposizione {
    static readonly type = '[MezziComposizione] Clear Selected Mezzi Composizione';
}

export class HoverInMezzoComposizione {
    static readonly type = '[MezziComposizione] Hover In Mezzo Composizione';

    constructor(public idMezzoComp: string, public coordinateFake?: boolean) {
    }
}

export class HoverOutMezzoComposizione {
    static readonly type = '[MezziComposizione] Hover Out Mezzo Composizione';
}

export class ClearMezzoComposizione {
    static readonly type = '[MezziComposizione] Clear Mezzo Composizione';
}

export class SganciamentoMezzoComposizione {
    static readonly type = '[MezziComposizione] Sganciamento Mezzo Composizione';

    constructor(public sganciamentoObj: SganciamentoInterface) {
    }
}

export class FilterListaMezziComposizione {
    static readonly type = '[MezziComposizione] Filter Lista Mezzi Composizione';

    constructor(public codDistaccamento?: string, public filtri?: ComposizioneFilterbar, public squadreComposizione?: SquadraComposizione[]) {
    }
}
