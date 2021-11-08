import { Tipologia } from '../../../model/tipologia.model';

export class GetTipologie {
    static readonly type = '[Tipologie] Get Tipologie';
}

export class SetTipologie {
    static readonly type = '[Tipologie] Set Tipologie';

    constructor(public tipologie: Tipologia[]) {
    }
}
