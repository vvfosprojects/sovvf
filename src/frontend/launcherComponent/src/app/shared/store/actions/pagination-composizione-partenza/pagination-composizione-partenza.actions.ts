import { PaginationInterface } from '../../../interface/pagination.interface';

export class PatchPaginationComposizionePartenza {
    static readonly type = '[PaginationComposizionePartenza] Patch Pagination Composizione Partenza';

    constructor(public type: string, public pagination: PaginationInterface) {
    }
}

export class ResetPaginationComposizionePartenza {
    static readonly type = '[PaginationComposizionePartenza] Reset Pagination Composizione Partenza';
}

export class ResetPaginationPreaccoppiati {
    static readonly type = '[PaginationComposizionePartenza] Reset Pagination Preaccoppiati';
}
