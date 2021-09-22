import { VoceFiltro } from "src/app/features/home/filterbar/filtri-richieste/voce-filtro.model";

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

export class SetFiltroAreaDocumentale {
    static readonly type = '[Area Documentale] Set Filtro Area Documentale';

    constructor(public filtro: VoceFiltro) {
    }
}

export class ClearFiltriAreaDocumentale {
    static readonly type = '[Area Documentale] Clear Filtri Area Documentale';

    constructor(public preventReloadLista?: boolean) {
    }
}

export class StartLoadingDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Start Loading Documenti Area Documentale';
}

export class StopLoadingDocumentiAreaDocumentale {
    static readonly type = '[Area Documentale] Stop Loading Documenti Area Documentale';
}
