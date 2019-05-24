import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

export class GetListeCoposizioneAvanzata {
    static readonly type = '[ComposizioneAvanzata] Get Liste Composizione Avanzata';

    constructor(public filtri: any) {
    }
}

export class SetListaSquadreComposizione {
    static readonly type = '[ComposizioneAvanzata] Set Lista Squadre Composizione';

    constructor(public squadreComposizione: SquadraComposizione[]) {
    }
}

export class SetListaMezziComposizione {
    static readonly type = '[ComposizioneAvanzata] Set Lista Mezzi Composizione';

    constructor(public mezziComposizione: MezzoComposizione[]) {
    }
}
