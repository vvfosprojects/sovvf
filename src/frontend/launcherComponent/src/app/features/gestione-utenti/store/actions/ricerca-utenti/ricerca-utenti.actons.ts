export class SetRicercaUtenti {
    static readonly type = '[RicercaUtenti] Set Ricerca';

    constructor(public ricerca: any) {}
}

export class ClearRicercaUtenti {
    static readonly type = '[RicercaUtenti] Clear Ricerca';
}
