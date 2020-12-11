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
