export class SetZoneEmergenzaSelezionate {
    static readonly type = '[ZoneEmergenza] Set Zone Emergenza Selezionate';

    constructor(public zoneEmergenza: string[]) {
    }
}

export class SetFakeStatoRichiesta {
    static readonly type = '[ZoneEmergenza] Set Stati Richiesta Fake';

    constructor(public zoneEmergenza: string) {
    }
}

export class SetChiuseRichiesta {
    static readonly type = '[ZoneEmergenza] Set Chiuse Richiesta';

    constructor(public chiuse: string) {
    }
}

export class SetZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Set Zone Emergenza';

    constructor(public zoneEmergenza: any[]) {
    }
}

export class SetPeriodoChiuse {
    static readonly type = '[ZoneEmergenza] Set Periodo Chiuse Filtri';

    constructor(public periodo: any, public tipologiaRichiesta: string) {
    }
}

export class RemovePeriodoChiuse {
    static readonly type = '[ZoneEmergenza] Remove Periodo Chiuse Filtri';

    constructor(public tipologiaRichiesta?: string) {
    }
}

export class RemoveFakeStatoRichiesta {
    static readonly type = '[ZoneEmergenza] Remove Stati Richiesta Fake';

    constructor(public zoneEmergenza: string) {
    }
}

export class RemoveChiuseRichiesta {
    static readonly type = '[ZoneEmergenza] Remove Chiuse Richiesta';

    constructor(public chiuse: string) {
    }
}

export class ResetFiltriStatiZone {
    static readonly type = '[ZoneEmergenza] Reset Zone Emergenza e Stati';
}

export class ResetFiltriZoneSelezionate {
    static readonly type = '[ZoneEmergenza] Reset Zone Emergenza Selezionate';
}
