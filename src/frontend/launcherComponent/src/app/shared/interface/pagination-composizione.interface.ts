import { PaginationInterface } from './pagination.interface';

export interface PaginationComposizione {
    mezziPagination: PaginationInterface;
    squadrePagination: PaginationInterface;
    codDistaccamentoMezzo?: string,
    codDistaccamentoSquadre?: string,
}