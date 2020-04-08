import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { ListaComposizioneAvanzata } from '../../../composizione-partenza/interface/lista-composizione-avanzata-interface';

export class GetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public filtri?: ComposizioneFilterbar,
                public onlySquadreComposizione?: boolean,
                public onlyMezziComposizione?: boolean) {
    }
}

export class SetListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Set Liste Composizione Avanzata';

    constructor(public listaMezziSquadre: ListaComposizioneAvanzata) {
    }
}

export class FilterListeComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Filter Lista Composizione Avanzata';

    constructor(public filtri?: ComposizioneFilterbar) {
    }
}

export class UnselectMezziAndSquadreComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Unselect Mezzi and Squadre Composizione Avanzata';
}

export class ClearComposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Clear Composizione Partenza Avanzata';
}
