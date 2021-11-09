import { ModuloColonnaMobile } from '../../../interface/modulo-colonna-mobile.interface';

export class GetModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Get Moduli Colonna Mobile';

    constructor(public nomeModulo: string) {
    }
}

export class SetModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Set Moduli Colonna Mobile';

    constructor(public nomeModulo: string, public moduliColonnaMobile: ModuloColonnaMobile[]) {
    }
}

export class SetModuloSelezionato {
    static readonly type = '[Moduli Colonna Mobile] Set Modulo Selezionato';

    constructor(public modulo: ModuloColonnaMobile) {
    }
}

export class SetModuloDeselezionato {
    static readonly type = '[Moduli Colonna Mobile] Set Modulo Deselezionato';

    constructor(public idModulo: string) {
    }
}

export class StartLoadingModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Start Loading Moduli Colonna Mobile';
}

export class StopLoadingModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Stop Loading Moduli Colonna Mobile';
}
