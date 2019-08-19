import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';

export class GetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public filtri?: ComposizioneFilterbar,
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
