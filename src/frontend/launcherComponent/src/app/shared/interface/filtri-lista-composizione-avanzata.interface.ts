import { PaginationInterface } from './pagination.interface';

export interface FiltriListaComposizioneAvanzata {
    idRichiesta: string;
    mezziPagination: PaginationInterface;
    squadrePagination: PaginationInterface;
    // filtri
}