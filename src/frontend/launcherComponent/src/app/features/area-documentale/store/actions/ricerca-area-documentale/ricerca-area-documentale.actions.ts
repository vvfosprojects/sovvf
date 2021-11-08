export class SetRicercaAreaDocumentale {
    static readonly type = '[Ricerca] Set Ricerca Area Documentale';

    constructor(public ricerca: any) {
    }
}

export class ClearRicercaAreaDocumentale {
    static readonly type = '[Ricerca] Clear Ricerca Area Documentale';
}
