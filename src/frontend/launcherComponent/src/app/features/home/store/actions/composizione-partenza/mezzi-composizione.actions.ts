import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

export class SetListaMezziComposizione {
    static readonly type = '[ComposizioneAvanzata] Set Lista Mezzi Composizione';

    constructor(public mezziComposizione: MezzoComposizione[]) {
    }
}
