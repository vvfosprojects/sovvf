import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';

export class SetListaSquadreComposizione {
    static readonly type = '[SquadreComposizione] Set Lista Squadre Composizione';

    constructor(public squadre: SquadraComposizione[]) {
    }
}

export class AddSquadraComposizione {
    static readonly type = '[SquadreComposizione] Add Squadra Composizione';

    constructor(public squadra: SquadraComposizione) {
    }
}

export class RemoveSquadraComposizione {
    static readonly type = '[SquadreComposizione] Remove Squadra Composizione';

    constructor(public idSquadra: string) {
    }
}

export class UpdateSquadraComposizione {
    static readonly type = '[SquadreComposizione] Update Squadra Composizione';

    constructor(public squadra: SquadraComposizione) {
    }
}

export class SelectSquadraComposizione {
    static readonly type = '[SquadreComposizione] Select Squadra Composizione';

    constructor(public idSquadra: string) {
    }
}

export class UnselectSquadraComposizione {
    static readonly type = '[SquadreComposizione] Unselect Squadra Composizione';

    constructor(public idSquadra: string) {
    }
}
