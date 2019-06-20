import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';

export class AddBoxPartenza {
    static readonly type = '[BoxPartenza] Add Box Partenza';
}

export class RequestAddBoxPartenza {
    static readonly type = '[BoxPartenza] Request Add Box Partenza';
}

export class RemoveBoxPartenza {
    static readonly type = '[BoxPartenza] Remove Box Partenza';

    constructor(public boxPartenza: BoxPartenza) {
    }
}

export class RemoveBoxPartenzaByMezzoId {
    static readonly type = '[BoxPartenza] Remove Box Partenza By Mezzo ID';

    constructor(public idMezzo: string) {
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

export class ClearBoxPartenze {
    static readonly type = '[BoxPartenza] Clear Box Partenze';
}

export class AddMezzoBoxPartenzaSelezionato {
    static readonly type = '[BoxPartenza] Add Mezzo Box Partenza Selezionato';

    constructor(public mezzo: MezzoComposizione) {
    }
}

export class RemoveMezzoBoxPartenzaSelezionato {
    static readonly type = '[BoxPartenza] Remove Mezzo Box Partenza Selezionato';

    constructor(public mezzo: MezzoComposizione) {
    }
}

export class UpdateMezzoBoxPartenza {
    static readonly type = '[BoxPartenza] Update Mezzo Box Partenza Selezionato';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class SelectBoxPartenza {
    static readonly type = '[BoxPartenza] Select Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}

export class UnselectBoxPartenza {
    static readonly type = '[BoxPartenza] Unselect Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}
