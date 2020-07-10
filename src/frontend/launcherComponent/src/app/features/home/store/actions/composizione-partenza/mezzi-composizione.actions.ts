import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { Mezzo } from '../../../../../shared/model/mezzo.model';

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

export class SelectMezzoComposizioneFromMappa {
    static readonly type = '[MezziComposizione] Select Mezzo Composizione From Mappa';

    constructor(public mezzoId: string) {
    }
}

export class SelectMezzoComposizione {
    static readonly type = '[MezziComposizione] Select Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class UnselectMezzoComposizione {
    static readonly type = '[MezziComposizione] Unselect Mezzo Composizione';
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

export class RequestBookMezzoComposizione {
    static readonly type = '[MezziComposizione] Request Book Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione, public addBoxPartenza?: boolean, public selectBoxPartenza?: string) {
    }
}

export class AddBookMezzoComposizione {
    static readonly type = '[MezziComposizione] Book Mezzo Composizione';

    constructor(public codiceMezzo: string) {
    }
}

export class AddBookingMezzoComposizione {
    static readonly type = '[MezziComposizione] Booking Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class RequestRemoveBookMezzoComposizione {
    static readonly type = '[MezziComposizione] Request Remove Book Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione, public boxPartenza?: BoxPartenza) {
    }
}

export class RemoveBookMezzoComposizione {
    static readonly type = '[MezziComposizione] Remove Book Mezzo Composizione';

    constructor(public codiceMezzo: string) {
    }
}


export class RemoveBookingMezzoComposizione {
    static readonly type = '[MezziComposizione] Remove Booking Mezzo Composizione';

    constructor(public codiceMezzo: string) {
    }
}

export class RequestResetBookMezzoComposizione {
    static readonly type = '[MezziComposizione] Request Reset Book Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class ResetBookMezzoComposizione {
    static readonly type = '[MezziComposizione] Reset Book Mezzo Composizione';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class LockMezzoComposizione {
    static readonly type = '[MezziComposizione] Lock Mezzo Composizione';

    constructor(public idMezzoComp: string) {
    }
}

export class UnlockMezzoComposizione {
    static readonly type = '[MezziComposizione] Unlock Mezzo Composizione';

    constructor(public idMezzoComp: string) {
    }
}

export class RequestUnlockMezzoComposizione {
    static readonly type = '[MezziComposizione] Request Unlock Mezzo Composizione';

    constructor(public idMezzoComp: string) {
    }
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
