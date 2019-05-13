import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';

export class GetMezziComposizione {
    static readonly type = '[MezziComposizione] Get Mezzi Composizione';
}

export class SetMezziComposizione {
    static readonly type = '[MezziComposizione] Set Mezzi Composizione';

    constructor(public mezzoComposizione: MezzoComposizione[]) {
    }
}
