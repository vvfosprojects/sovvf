import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

export class AddBoxPartenza {
    static readonly type = '[BoxPartenza] Add Box Partenza';
}

export class RemoveBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}

export class AddSquadraBoxPartenza {
    static readonly type = '[BoxPartenza] Add Squadra Box Partenza';

    constructor(public squadra: SquadraComposizione) {
    }
}

export class RemoveSquadraBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Squadra Box Partenza';

    constructor(public idSquadra: string) {
    }
}

export class AddMezzoBoxPartenza {
    static readonly type = '[BoxPartenza] Add Squadra Box Partenza';

    constructor(public mezzo: MezzoComposizione) {
    }
}

export class RemoveMezzoBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Squadra Box Partenza';

    constructor(public idMezzo: string) {
    }
}

export class SelectBoxPartenza {
    static readonly type = '[BoxPartenza] Select Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}
