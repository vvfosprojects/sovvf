import {FiltriComposizione} from '../../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';

export class GetListaMezziSquadre {
    static readonly type = '[SostituzionePartenza] Get Lista Mezzi Squadre';

  constructor(public options?: { filtri?: FiltriComposizione, page?: { pageMezzi?: number, pageSquadre?: number }, idRichiesta?: string }) {
  }
}

export class SetListaMezziSquadre {
    static readonly type = '[SostituzionePartenza] Set Lista Mezzi Squadre';

    constructor(public listaMezziSquadre: any) {
    }
}

export class StartListaComposizioneLoading {
    static readonly type = '[SostituzionePartenza] Start Lista Composizione Loading';
}

export class StopListaComposizioneLoading {
    static readonly type = '[SostituzionePartenza] Stop Lista Composizione Loading';
}

export class IdRichiestaSostituzione {
  static readonly type = '[SostituzionePartenza] Id Richiesta Sostituzione';

  constructor(public idRichiesta: string) {
  }
}
