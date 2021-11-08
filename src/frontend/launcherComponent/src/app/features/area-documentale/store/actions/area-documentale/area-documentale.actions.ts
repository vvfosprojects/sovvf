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

export class SetCodCategoriaAreaDocumentale {
    static readonly type = '[Area Documentale] Set CodCategoria Area Documentale';

    constructor(public codCategoria: string) {
    }
}

export class ClearCodCategoriaAreaDocumentale {
    static readonly type = '[Area Documentale] Clear CodCategoria Area Documentale';
}

export class SetDescCategoriaAreaDocumentale {
    static readonly type = '[Area Documentale] Set DescCategoria Area Documentale';

    constructor(public codCategoria: string) {
    }
}

export class ClearDescCategoriaAreaDocumentale {
    static readonly type = '[Area Documentale] Clear DescCategoria Area Documentale';
}

export class StartLoadingDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Start Loading Documenti Area Documentale';
}

export class StopLoadingDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Stop Loading Documenti Area Documentale';
}
