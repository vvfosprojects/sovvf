
export class SetZoneEmergenza {
  static readonly type = '[ZoneEmergenza] Set Zone Emergenza';

  constructor(public zoneEmergenza: string[]) {
  }
}

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

export class RemoveFakeStatoRichiesta {
  static readonly type = '[ZoneEmergenza] Remove Stati Richiesta Fake';

  constructor(public zoneEmergenza: string) {
  }
}

export class ResetFiltriStatiZone {
  static readonly type = '[ZoneEmergenza] Reset Zone Emergenza e Stati';
}
