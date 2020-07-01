import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { MezzoActionInterface } from '../../../../../shared/interface/mezzo-action.interface';
import { StatoRichiesta } from '../../../../../shared/enum/stato-richiesta.enum';
import { RichiestaActionInterface } from '../../../../../shared/interface/richiesta-action.interface';
import { ListaSquadre } from '../../../../../shared/interface/lista-squadre';

export class GetListaRichieste {
    static readonly type = '[Richieste] Get Lista Richieste API';

    constructor(public options?: { page?: number }) {
    }
}

export class PatchRichiesta {
    static readonly type = '[Richieste] Modifica Richiesta API';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class AddRichieste {
    static readonly type = '[Richieste] Add Richieste';

    constructor(public richieste: SintesiRichiesta[]) {
    }
}

export class ClearRichieste {
    static readonly type = '[Richieste] Clear Lista Richieste';
}

export class SetNeedRefresh {
    static readonly type = '[Richieste] Set Need Refresh';

    constructor(public value: boolean) {
    }
}

export class UpdateRichiesta {
    static readonly type = '[Richieste] Modifica Richiesta';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class AddRichiesta {
    static readonly type = '[Richieste] Add Richiesta';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class CambiaStatoRichiesta {
    static readonly type = '[Richieste] Cambia Stato Richiesta';

    constructor(public idRichiesta: string, public stato: StatoRichiesta) {
    }
}

export class SetIdChiamataInviaPartenza {
    static readonly type = '[Richieste] Set ID Chiamata Invia Partenza';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ClearIdChiamataInviaPartenza {
    static readonly type = '[Richieste] Clear ID Chiamata Invia Partenza';

}

export class StartInviaPartenzaFromChiamata {
    static readonly type = '[Richieste] Start Invia Partenza From Chiamata';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class ActionMezzo {
    static readonly type = '[Richieste] Action Mezzo';

    constructor(public mezzoAction: MezzoActionInterface) {
    }
}

export class EliminaPartenzaRichiesta {
    static readonly type = '[Richieste] Elimina Partenza';

    constructor(public targaMezzo: string,
                public idRichiesta: string,
                public motivazione: { codMotivazione: string, testoMotivazione?: string, codRichiestaSubentrata?: string }) {
    }
}

export class ActionRichiesta {
    static readonly type = '[Richieste] Action Richiesta';

    constructor(public richiestaAction: RichiestaActionInterface) {
    }
}

export class SetRichiestaById {
    static readonly type = '[Richieste] Set Richiesta by Id';

    constructor(public idRichiesta: string) {
    }
}

export class ClearRichiestaById {
    static readonly type = '[Richieste] Clear Richiesta by Id';
}

export class VisualizzaListaSquadrePartenza {
    static readonly type = '[Richieste] Visualizza Lista Squadre Partenza';

    constructor(public listaSquadre: ListaSquadre) {
    }
}

export class StartLoadingRichieste {
    static readonly type = '[Richieste] Start Loading Richieste';
}

export class StopLoadingRichieste {
    static readonly type = '[Richieste] Stop Loading Richieste';
}

export class StartLoadingActionMezzo {
    static readonly type = '[Richieste] Start Loading Action Mezzo';

    constructor(public idMezzo: string) {
    }
}

export class StopLoadingActionMezzo {
    static readonly type = '[Richieste] Stop Loading Action Mezzo';
}

export class StartLoadingEliminaPartenza {
    static readonly type = '[Richieste] Start Loading Elimina Partenza';
}

export class StopLoadingEliminaPartenza {
    static readonly type = '[Richieste] Stop Loading Elimina Partenza';
}

export class StartLoadingActionRichiesta {
    static readonly type = '[Richieste] Start Loading Action Richiesta';

    constructor(public idRichiesta: string) {
    }
}

export class StopLoadingActionRichiesta {
    static readonly type = '[Richieste] Stop Loading Action Richiesta';
}

