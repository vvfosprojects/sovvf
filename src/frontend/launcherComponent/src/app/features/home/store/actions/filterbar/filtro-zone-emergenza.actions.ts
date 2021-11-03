export class SetFiltroZoneEmergenzaSelezionate {
    static readonly type = '[ZoneEmergenza] Set Filtro Zone Emergenza Selezionate';

    constructor(public zoneEmergenza: string[]) {
    }
}

export class SetFiltroZoneEmergenza {
    static readonly type = '[ZoneEmergenza] Set Filtro Zone Emergenza';

    constructor(public zoneEmergenza: any[]) {
    }
}

export class ResetFiltriStatiZone {
    static readonly type = '[ZoneEmergenza] Reset Filtri Zone Emergenza e Stati';
}

export class ResetFiltriZoneSelezionate {
    static readonly type = '[ZoneEmergenza] Reset Filtri Zone Emergenza Selezionate';
}
