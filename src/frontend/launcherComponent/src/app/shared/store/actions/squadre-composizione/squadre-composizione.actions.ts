import { SquadraComposizione } from '../../../interface/squadra-composizione-interface';

export class SetListaSquadreComposizione {
    static readonly type = '[SquadreComposizione] Set Lista Squadre Composizione';

    constructor(public squadreComp?: SquadraComposizione[]) {
    }
}

export class ClearListaSquadreComposizione {
    static readonly type = '[SquadreComposizione] Clear Lista Squadre Composizione';
}

export class ClearIdSquadreSelezionate {
    static readonly type = '[SquadreComposizione] Clear Id Squadre Selezionate';
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

    constructor(public squadraComp: SquadraComposizione, public dividiSquadra?: boolean, public preaccoppiato?: boolean) {
    }
}

export class SelectSquadraComposizioneInRientro {
    static readonly type = '[SquadreComposizione] Select Squadra Composizione In Rientro';

    constructor(public squadraComp: SquadraComposizione, public noAddBox?: boolean) {
    }
}

export class SelectSquadraComposizionePreAccoppiati {
    static readonly type = '[SquadreComposizione] Select Squadra Composizione Pre Accoppiati';

    constructor(public squadraComp: SquadraComposizione, public noAddBox?: boolean) {
    }
}

export class UnselectSquadraComposizione {
    static readonly type = '[SquadreComposizione] Unselect Squadra Composizione';

    constructor(public squadraComp: SquadraComposizione, public dividiSquadra?: boolean, public preventGet?: boolean) {
    }
}

export class UnselectSquadraComposizioneInRientro {
    static readonly type = '[SquadreComposizione] Unselect Squadra Composizione In Rientro';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class UnselectSquadraComposizionePreAccoppiati {
    static readonly type = '[SquadreComposizione] Unselect Squadra Composizione Pre Accoppiati';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class SelectSquadreComposizione {
    static readonly type = '[SquadreComposizione] Select Squadre Composizione';

    constructor(public squadreComp: SquadraComposizione[], public noSelect?: boolean, public preAccoppiato?: boolean) {
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
