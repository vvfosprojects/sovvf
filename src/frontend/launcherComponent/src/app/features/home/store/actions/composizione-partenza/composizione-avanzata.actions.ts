import { ListaComposizioneAvanzata } from '../../../../../shared/interface/lista-composizione-avanzata-interface';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';

export class GetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public options?: { filtri?: FiltriComposizione, page?: { pageMezzi?: number, pageSquadre?: number } }) {
    }
}

export class SetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Set Liste Composizione Avanzata';

    constructor(public listaMezziSquadre: ListaComposizioneAvanzata) {
    }
}

export class UnselectMezziAndSquadreComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Unselect Mezzi and Squadre Composizione Avanzata';
}

export class ClearComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Clear Composizione Partenza Avanzata';
}
