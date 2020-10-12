import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPaginationMezziSquadre {
    static readonly type = '[PaginationComposizionePartenza] Patch Pagination';

    constructor(public type: string, public pagination: PaginationInterface) {
    }
}

export class ResetPaginationMezziSquadre {
    static readonly type = '[PaginationComposizionePartenza] Reset Pagination Mezzi/Squadre';
}

export class ResetPaginationPreaccoppiati {
    static readonly type = '[PaginationComposizionePartenza] Reset Pagination Preaccoppiati';
}
