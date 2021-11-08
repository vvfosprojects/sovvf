import { MezzoComposizione } from '../../../../../shared/interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';

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

export class DeselectBoxPartenza {
    static readonly type = '[BoxPartenza] Deselect Box Partenza';

    constructor(public boxPartenza: BoxPartenza, public refreshLista?: boolean) {
    }
}

export class RemoveBoxPartenzaByMezzoId {
    static readonly type = '[BoxPartenza] Remove Box Partenza By Mezzo ID';

    constructor(public idMezzo: string) {
    }
}

export class AddSquadreBoxPartenza {
    static readonly type = '[BoxPartenza] Add Squadre Box Partenza';

    constructor(public squadre: SquadraComposizione[], public preAccoppiato?: boolean) {
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
}

export class UpdateMezzoBoxPartenza {
    static readonly type = '[BoxPartenza] Update Mezzo Box Partenza Selezionato';

    constructor(public mezzoComp: MezzoComposizione) {
    }
}

export class RequestSelectBoxPartenza {
    static readonly type = '[BoxPartenza] Request Select Box Partenza';

    constructor(public idBoxPartenza: string) {
    }
}

export class SelectBoxPartenza {
    static readonly type = '[BoxPartenza] Select Box Partenza';

    constructor(public idBoxPartenza: string, public inRientro?: boolean, public preaccoppiato?: boolean) {
    }
}

export class AddBoxesPartenzaInRientro {
    static readonly type = '[BoxPartenza] Add Boxes Partenza In Rientro';

    constructor(public squadraComp: SquadraComposizione) {
    }
}

export class AddBoxesPartenzaPreAccoppiato {
  static readonly type = '[BoxPartenza] Add Boxes Partenza Pre Accoppiato';

  constructor(public squadraComp: SquadraComposizione) {
  }
}
