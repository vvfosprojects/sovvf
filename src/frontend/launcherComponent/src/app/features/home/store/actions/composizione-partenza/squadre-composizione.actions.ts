import { SquadraComposizione } from '../../../composizione-partenza/interface/squadra-composizione-interface';

export class SetListaSquadreComposizione {
    static readonly type = '[ComposizioneAvanzata] Set Lista Squadre Composizione';

    constructor(public squadreComposizione: SquadraComposizione[]) {
    }
}
