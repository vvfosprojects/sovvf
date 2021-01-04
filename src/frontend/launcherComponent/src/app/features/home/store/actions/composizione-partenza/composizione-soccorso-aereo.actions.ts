
export class SetMotivazioneRichiesta {
  static readonly type = '[ComposizioneSoccorsoAereo] Update Motivazione Richiesta Soccorso Aereo';

  constructor(public motivazione: string) {
  }
}
