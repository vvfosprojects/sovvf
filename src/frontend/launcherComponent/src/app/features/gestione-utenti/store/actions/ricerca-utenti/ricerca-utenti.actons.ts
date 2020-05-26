export class SetRicercaUtenti {
    static readonly type = '[RicercaUtenti] Set Ricerca';

    constructor(public ricerca: any) {}
}

export class ClearRicercaUtenti {
    static readonly type = '[RicercaUtenti] Clear Ricerca';
}

export class SetSediFiltro {
    static readonly type = '[RicercaUtenti] Set Sedi Filtro';

    constructor(public sedi: string[]) {}
}

export class ClearSediFiltro {
    static readonly type = '[RicercaUtenti] Clear Sedi Filtro';
}
