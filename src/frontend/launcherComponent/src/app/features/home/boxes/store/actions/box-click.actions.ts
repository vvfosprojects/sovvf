// REDUCER
export class Reducer {
    static readonly type = '[BoxClick] Reduce completato';

    constructor(public cat: string, public tipo: string) { }
}

// INIZIALIZZAZIONE
export class InitBoxFiltri {
    static readonly type = '[BoxClick] Inizializza tutti i filtri';
}

// RICHIESTE
export class UpdateBoxRichieste {
    static readonly type = '[BoxClick] Modifica filtro richieste';

    constructor(public tipo: string) { }
}
export class AllTrueBoxRichieste {
    static readonly type = '[BoxClick] Attivati tutti i filtri richieste';
}
export class AllFalseBoxRichieste {
    static readonly type = '[BoxClick] Reset filtri richieste';
}

// MEZZI
export class UpdateBoxMezzi {
    static readonly type = '[BoxClick] Modifica filtro mezzi';

    constructor(public tipo: string) { }
}
export class AllTrueBoxMezzi {
    static readonly type = '[BoxClick] Attivati tutti i filtri mezzi';
}
export class AllFalseBoxMezzi {
    static readonly type = '[BoxClick] Reset filtri mezzi';
}

// TUTTI
export class ResetAllBoxes {
    static readonly type = '[BoxClick] Reset tutti filtri completato';
}
