
export class GetAzioniRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Azioni Richiesta Soccorso Aereo';
}

export class GetTipologieRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Tipologie Richiesta Soccorso Aereo';
}

export class AddSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Add Richiesta Soccorso Aereo';

  constructor(public richiesta: any) {
  }
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

export class AddTipologieRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Add Tipologie Richieste';

  constructor(public tipologieRichiesta: any) {
  }
}

