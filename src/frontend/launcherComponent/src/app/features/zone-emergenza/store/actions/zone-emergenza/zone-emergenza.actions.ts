import { ZonaEmergenza } from '../../../../../shared/model/zona-emergenza.model';

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
