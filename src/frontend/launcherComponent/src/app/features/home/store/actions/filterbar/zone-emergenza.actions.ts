export class SetZoneEmergenzaSelezionate {
    static readonly type = '[ZoneEmergenza] Set Zone Emergenza Selezionate';

    constructor(public zoneEmergenza: string[]) {
    }
}

export class SetZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Set Zone Emergenza';

    constructor(public zoneEmergenza: any[]) {
    }
}

export class ResetFiltriStatiZone {
    static readonly type = '[ZoneEmergenza] Reset Zone Emergenza e Stati';
}

export class ResetFiltriZoneSelezionate {
    static readonly type = '[ZoneEmergenza] Reset Zone Emergenza Selezionate';
}
