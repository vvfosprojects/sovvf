import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPagination {
    static readonly type = '[Pagination] Patch Pagination';

    constructor(public pagination: PaginationInterface) {
    }
}
