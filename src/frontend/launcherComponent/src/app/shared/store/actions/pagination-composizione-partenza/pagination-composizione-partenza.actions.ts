import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPaginationMezziSquadre {
    static readonly type = '[Pagination] Patch Pagination';

    constructor(public pagination: PaginationInterface) {
    }
}