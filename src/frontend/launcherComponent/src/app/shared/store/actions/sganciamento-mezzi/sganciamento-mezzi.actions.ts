import { MezzoInServizio } from '../../../interface/mezzo-in-servizio.interface';

export class GetListaMezziSganciamento {
    static readonly type = '[SganciamentoMezzi] Get Lista Mezzi Sganciamento';
}

export class SetListaMezziSganciamento {
    static readonly type = '[SganciamentoMezzi] Set Lista Mezzi Sganciamento';

    constructor(public listaMezzi: MezzoInServizio[]) {
    }
}

export class ClearListaMezziSganciamento {
    static readonly type = '[SganciamentoMezzi] Clear Lista Mezzi Sganciamento';
}

export class StartLoadingMezziSganciamento {
    static readonly type = '[SganciamentoMezzi] Start Loading Mezzi Sganciamento';
}

export class StopLoadingMezziSganciamento {
    static readonly type = '[SganciamentoMezzi] Stop Loading Mezzi Sganciamento';
}

