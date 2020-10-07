import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPaginationMezziSquadre {
    static readonly type = '[PaginationComposizionePartenza] Patch Pagination';

    constructor(public type: string, public pagination: PaginationInterface) {
    }
}

export class PatchCodDistaccamentoMezzo {
    static readonly type = '[PatchCodDistaccamentoMezzo] Patch Cod Distaccamento Mezzo';

    constructor(public codDistaccamento: string) {
    }
}

export class PatchCodDistaccamentoSquadre {
    static readonly type = '[PatchCodDistaccamentoSquadre] Patch Cod Distaccamento Squadre';

    constructor(public codDistaccamento: string) {
    }
}