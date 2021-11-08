export class AddDocumentoAreaDocumentale {
    static readonly type = '[DocumentoAreaDocumentaleModal] Add Documento Area Documentale';

    constructor(public formData: FormData) {
    }
}

export class EditDocumentoAreaDocumentale {
    static readonly type = '[DocumentoAreaDocumentaleModal] Edit Documento Area Documentale';

    constructor(public id: string, public formData: FormData) {
    }
}

export class DeleteDocumentoAreaDocumentale {
    static readonly type = '[DocumentoAreaDocumentaleModal] Delete Documento Area Documentale';

    constructor(public id: string) {
    }
}

export class ResetDocumentoAreaDocumentaleModal {
    static readonly type = '[DocumentoAreaDocumentaleModal] Reset Documento Area Documentale Modal';
}
