import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';
import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { MezzoComposizione } from '../../../../../shared/interface/mezzo-composizione-interface';

export class SetListaSquadreComposizione {
    static readonly type = '[SquadreComposizione] Set Lista Squadre Composizione';

    constructor(public squadreComp?: SquadraComposizione[]) {
    }
}

export class ClearListaSquadreComposizione {
    static readonly type = '[SquadreComposizione] Clear Lista Squadre Composizione';
}

export class AddSquadraComposizione {
    static readonly type = '[SquadreComposizione] Add Squadra Composizione';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class RemoveSquadraComposizione {
    static readonly type = '[SquadreComposizione] Remove Squadra Composizione';

    constructor(public idSquadra: string) {
    }
}

export class UpdateSquadraComposizione {
    static readonly type = '[SquadreComposizione] Update Squadra Composizione';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class SelectSquadraComposizione {
    static readonly type = '[SquadreComposizione] Select Squadra Composizione';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class UnselectSquadraComposizione {
    static readonly type = '[SquadreComposizione] Unselect Squadra Composizione';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class SelectSquadra {
    static readonly type = '[SquadreComposizione] Select Squadra';

    constructor(public idSquadra: string) {
    }
}

export class UnselectSquadra {
    static readonly type = '[SquadreComposizione] Unselect Squadra';

    constructor(public idSquadra: string) {
    }
}

export class ClearSelectedSquadreComposizione {
    static readonly type = '[SquadreComposizione] Clear Selected Squadre Composizione';
}

export class HoverInSquadraComposizione {
    static readonly type = '[SquadreComposizione] Hover In Squadra Composizione';

    constructor(public idSquadraComp: string) {
    }
}

export class HoverOutSquadraComposizione {
    static readonly type = '[SquadreComposizione] Hover Out Squadra Composizione';

    constructor(public idSquadraComp: string) {
    }
}

export class ClearSquadraComposizione {
    static readonly type = '[SquadreComposizione] Clear Squadra Composizione';
}

export class FilterListaSquadreComposizione {
    static readonly type = '[SquadreComposizione] Filter Lista Squadre Composizione';

    constructor(public codDistaccamento?: string, public filtri?: ComposizioneFilterbar, public mezziComposizione?: MezzoComposizione[]) {
    }
}
