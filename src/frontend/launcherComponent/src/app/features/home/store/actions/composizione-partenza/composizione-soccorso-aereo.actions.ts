
export class GetAzioniRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Azioni Richiesta Soccorso Aereo';
}

export class SetMotivazioneRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Update Motivazione Richiesta Soccorso Aereo';

  constructor(public motivazione: string) {
  }
}

export class AddAzioniRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Add Richieste';

  constructor(public richieste: any) {
  }
}
