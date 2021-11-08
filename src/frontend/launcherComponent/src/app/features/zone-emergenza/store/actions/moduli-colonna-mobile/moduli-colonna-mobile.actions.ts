export class GetModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Get Moduli Colonna Mobile';

    constructor(public nomeModulo: string) {
    }
}

export class SetModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Set Moduli Colonna Mobile';

    constructor(public nomeModulo: string, public moduliColonnaMobile: any[]) {
    }
}

export class StartLoadingModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Start Loading Moduli Colonna Mobile';
}

export class StopLoadingModuliColonnaMobile {
    static readonly type = '[Moduli Colonna Mobile] Stop Loading Moduli Colonna Mobile';
}
