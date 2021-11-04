import { TipologiaEmergenza, ZonaEmergenza } from '../../../../../shared/model/zona-emergenza.model';

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

export class StartLoadingTipologieEmergenza {
    static readonly type = '[ZoneEmergenza] Start Loading Tipologie Emergenza';
}

export class StopLoadingTipologieEmergenza {
    static readonly type = '[ZoneEmergenza] Stop Loading Tipologie Emergenza';
}
