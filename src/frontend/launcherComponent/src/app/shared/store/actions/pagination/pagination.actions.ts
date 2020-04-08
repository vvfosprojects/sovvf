import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPagination {
    static readonly type = '[Pagination] Patch Pagination';

    constructor(public pagination: PaginationInterface) {
    }
}

export class SetPageSize {
    static readonly type = '[Pagination] Set Page Size';

    constructor(public pageSize: number) {
    }
}
