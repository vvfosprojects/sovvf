import { MezzoComposizione } from './mezzo-composizione-interface';
import { SquadraComposizione } from './squadra-composizione-interface';
import { PaginationInterface } from './pagination.interface';

export interface ListaComposizioneAvanzata {
    composizioneMezziDataArray: MezzoComposizione[];
    composizioneSquadreDataArray: SquadraComposizione[];
    mezziPagination: PaginationInterface;
    squadrePagination: PaginationInterface;
}
