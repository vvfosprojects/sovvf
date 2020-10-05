import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPaginationMezziSquadre {
    static readonly type = '[PaginationComposizionePartenza] Patch Pagination';

    constructor(public type: string, public pagination: PaginationInterface ) {
    }
}