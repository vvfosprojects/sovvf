import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export class GetRichieste {
    static readonly type = '[Richieste] Get Lista Richieste API';

    constructor(public idUltimaRichiesta?: string) {
    }
}

export class PatchRichiesta {
    static readonly type = '[Richieste] Modifica Richiesta API';

    constructor(public richiesta: SintesiRichiesta) {
    }
}

export class SetRichieste {
    static readonly type = '[Richieste] Set Lista Richieste';

    constructor(public richieste: SintesiRichiesta[]) {
    }
}

export class ClearRichieste {
    static readonly type = '[Richieste] Clear Lista Richieste';
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

export class SetIdChiamataInviaPartenza {
    static readonly type = '[Richieste] Set ID Chiamata Invia Partenza';

    constructor(public chiamataInviaPartenza: string) {
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

export class SetMezzoArrivatoSulPosto {
    static readonly type = '[Richieste] Set Mezzo Arrivato Sul Posto';

    constructor(public obj: any) {
    }
}
