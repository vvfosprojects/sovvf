import { TipologiaEmergenza, ZonaEmergenza } from '../../../model/zona-emergenza.model';
import { SetZonaEmergenzaFromMappaActiveValue } from '../tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.actions';
import { ModuloColonnaMobile } from '../../../interface/modulo-colonna-mobile.interface';

export class GetZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Get Zone Emergenza';

    constructor(public page?: number) {
    }
}

export class SetZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Set Zone Emergenza';

    constructor(public zoneEmergenza: ZonaEmergenza[]) {
    }
}

export class StartLoadingZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Start Loading Zone Emergenza';
}

export class StopLoadingZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Stop Loading Zone Emergenza';
}

export class GetTipologieEmergenza {
    static readonly type = '[ZoneEmergenza] Get Tipologie Emergenza';
}

export class SetTipologieEmergenza {
    static readonly type = '[ZoneEmergenza] Set Tipologie Emergenza';

    constructor(public tipologieEmergenza: TipologiaEmergenza[]) {
    }
}

export class AddZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Add Zona Emergenza';
}

export class EditZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Edit Zona Emergenza';
}

export class UpdateModuliZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Update Moduli Zona Emergenza';

    constructor(public zonaEmergenza: ZonaEmergenza, public moduli: ModuloColonnaMobile[]) {
    }
}

export class AnnullaZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Annulla Zona Emergenza';
}

export class AllertaCONZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Allerta CON Zona Emergenza';
}

export class StartLoadingTipologieEmergenza {
    static readonly type = '[ZoneEmergenza] Start Loading Tipologie Emergenza';
}

export class StopLoadingTipologieEmergenza {
    static readonly type = '[ZoneEmergenza] Stop Loading Tipologie Emergenza';
}

export class ResetZonaEmergenzaForm {
    static readonly type = '[ZoneEmergenza] Reset Zona Emergenza Form';
}

export class ResetAnnullaZonaEmergenzaForm {
    static readonly type = '[ZoneEmergenza] Reset Annulla Zona Emergenza Form';
}

export class ResetAllertaCONZonaEmergenzaForm {
    static readonly type = '[ZoneEmergenza] Reset Allerta CON Zona Emergenza Form';
}

export class SetMappaActiveValue {
    static readonly type = '[ZoneEmergenza] Set Mappa Active Value';

    constructor(public value: boolean) {
    }
}
