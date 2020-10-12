import { PaginationInterface } from './pagination.interface';

export interface PaginationComposizioneAvanzata {
    mezziPagination?: PaginationInterface;
    squadrePagination?: PaginationInterface;
    codDistaccamentoMezzo?: string;
    codDistaccamentoSquadre?: string;
}
