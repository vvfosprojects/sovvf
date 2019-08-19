import {
    FiltriComposizioneFilterbar
} from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';

export class GetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public filtri?: FiltriComposizioneFilterbar,
                public onlySquadreComposizione?: boolean,
                public onlyMezziComposizione?: boolean) {
    }
}

export class UnselectMezziAndSquadreComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Unselect Mezzi and Squadre Composizione Avanzata';
}

export class ClearComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Clear Composizione Partenza Avanzata';
}
