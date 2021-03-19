
export class GetAzioniRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Azioni Richiesta Soccorso Aereo';
}

/*
export class GetTipologieRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Tipologie Richiesta Soccorso Aereo';
}
*/

export class AddSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Add Richiesta Soccorso Aereo';

  constructor(public richiesta: any) {
  }
}

export class GetDettaglioSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Dettaglio Soccorso Aereo';

  constructor(public codRichiesta: string) {
  }
}

export class GetEventiSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Get Eventi Soccorso Aereo';

  constructor(public codRichiesta: string) {
  }
}

export class RemoveSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Remove Richiesta Soccorso Aereo';

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

export class SetDettaglioSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Set Dettaglio Soccorso Aereo';

  constructor(public dettaglioAFM: any[]) {
  }
}

export class SetEventiSoccorsoAereo {
  static readonly type = '[ComposizioneSoccorsoAereo] Set Eventi Soccorso Aereo';

  constructor(public eventiAFM: any[]) {
  }
}

