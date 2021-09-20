export class GetDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Get Documenti Area Documentale';

    constructor(public page?: number) {
    }
}

export class SetDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Set Documenti Area Documentale';

    constructor(public documentiAreaDocumentale: any[]) {
    }
}

export class StartLoadingDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Start Loading Documenti Area Documentale';
}

export class StopLoadingDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Stop Loading Documenti Area Documentale';
}
