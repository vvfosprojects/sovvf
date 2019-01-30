
export class Reducer {
    static readonly type = '[BoxClick] Reduce completato';

    constructor(public cat: string, public tipo: string) { }
}

export class InitBoxFiltri {
    static readonly type = '[BoxClick] Inizializza tutti i filtri';
}

export class UpdateBoxRichieste {
    static readonly type = '[BoxClick] Modifica filtro richieste';

    constructor(public tipo: string) { }
}

export class ResetBoxRichieste {
    static readonly type = '[BoxClick] Reset filtri richieste';
}

export class UpdateBoxMezzi {
    static readonly type = '[BoxClick] Modifica filtro mezzi';

    constructor(public tipo: string) { }
}

export class ResetBoxMezzi {
    static readonly type = '[BoxClick] Reset filtri mezzi';
}

export class ResetAllBoxes {
    static readonly type = '[BoxClick] Reset tutti filtri completato';
}
