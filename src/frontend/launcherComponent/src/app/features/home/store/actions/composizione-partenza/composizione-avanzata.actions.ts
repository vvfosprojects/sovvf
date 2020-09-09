import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { ListaComposizioneAvanzata } from '../../../../../shared/interface/lista-composizione-avanzata-interface';

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

export class SetRicercaSquadreComposizione {
    static readonly type = '[ComposizioneAvanzata] Set Ricerca Squadre Composizione';

    constructor(public ricerca: string) {
    }
}

export class ResetRicercaSquadreComposizione {
    static readonly type = '[ComposizioneAvanzata] Reset Ricerca Squadre Composizione';
}

export class SetRicercaMezziComposizione {
    static readonly type = '[ComposizioneAvanzata] Set Ricerca Mezzi Composizione';

    constructor(public ricerca: string) {
    }
}

export class ResetRicercaMezziComposizione {
    static readonly type = '[ComposizioneAvanzata] Reset Ricerca Mezzi Composizione';
}
