import { EventoEmergenza, TipologiaEmergenza, ZonaEmergenza } from '../../../model/zona-emergenza.model';
import { ModuloColonnaMobile } from '../../../interface/modulo-colonna-mobile.interface';
import { DoaForm } from '../../../interface/doa-form.interface';
import { PcaForm } from '../../../interface/pca-form.interface';

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

export class GetZonaEmergenzaById {
    static readonly type = '[ZoneEmergenza] Get Zona Emergenza By Id';

    constructor(public id: string) {
    }
}

export class SetZonaEmergenzaById {
    static readonly type = '[ZoneEmergenza] Set Zona Emergenza By Id';

    constructor(public zonaEmergenza: ZonaEmergenza) {
    }
}

export class SetFiltriStatiModuliColonnaMobile {
    static readonly type = '[ZoneEmergenza] Set Filtri Stati Moduli Colonna Mobile';

    constructor(public statiModuliColonnaMobile: string[]) {
    }
}

export class SetFiltriGeneriModuliColonnaMobile {
    static readonly type = '[ZoneEmergenza] Set Filtri Generi Moduli Colonna Mobile';

    constructor(public generiModuliColonnaMobile: string[]) {
    }
}

export class SetFiltriAttiviStatiModuliColonnaMobile {
    static readonly type = '[ZoneEmergenza] Set Filtri Attivi Stati Moduli Colonna Mobile';

    constructor(public statiModuliColonnaMobile: string[]) {
    }
}

export class SetFiltriAttiviGeneriModuliColonnaMobile {
    static readonly type = '[ZoneEmergenza] Set Filtri Attivi Generi Moduli Colonna Mobile';

    constructor(public generiModuliColonnaMobile: string[]) {
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

export class RequestCra {
    static readonly type = '[ZoneEmergenza] Request Cra Doa';
}

export class RequestTipologieModuli {
    static readonly type = '[ZoneEmergenza] Request Tipologie Moduli';
}

export class EditZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Edit Zona Emergenza';
}

export class SetEventoRichiestaGestitoZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Set Evento Richiesta Gestito Zona Emergenza';

    constructor(public eventoGestito?: EventoEmergenza) {
    }
}

export class UpdateModuliMobImmediataZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Update Moduli Mob_Immediata Zona Emergenza';

    constructor(public zonaEmergenza: ZonaEmergenza, public moduliMobImmediata: ModuloColonnaMobile[], public eventoGestito?: EventoEmergenza) {
    }
}

export class UpdateModuliMobPotIntZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Update Moduli Mob_Pot_Int Zona Emergenza';

    constructor(public zonaEmergenza: ZonaEmergenza, public moduliMobPotInt: ModuloColonnaMobile[]) {
    }
}

export class UpdateModuliMobConsolidamentoZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Update Moduli Mob_Consolidamento Zona Emergenza';

    constructor(public zonaEmergenza: ZonaEmergenza, public moduliMobConsolidamento: ModuloColonnaMobile[]) {
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

export class ResetDoaForm {
    static readonly type = '[ZoneEmergenza] Reset Doa Form';
}

export class AddDoa {
    static readonly type = '[ZoneEmergenza] Add Doa';

    constructor(public doa: DoaForm) {
    }
}

export class DeleteDoa {
    static readonly type = '[ZoneEmergenza] Delete Doa';

    constructor(public codice: string) {
    }
}

export class ResetPcaForm {
    static readonly type = '[ZoneEmergenza] Reset Pca Form';
}

export class AddPca {
    static readonly type = '[ZoneEmergenza] Add Pca';

    constructor(public pca: PcaForm, public codiceDoa: string) {
    }
}

export class DeletePca {
    static readonly type = '[ZoneEmergenza] Delete Pca';

    constructor(public codice: string) {
    }
}

export class SaveCraZonaEmergenza {
    static readonly type = '[ZoneEmergenza] Save Cra Zona Emergenza';

    constructor(public istanteEventoRichiestaCRA: string) {
    }
}
