import { MezzoComposizione } from './mezzo-composizione-interface';
import { PaginationInterface } from './pagination.interface';
import { SquadraComposizione } from './squadra-composizione-interface';

// tslint:disable-next-line:no-empty-interface
export interface ListaComposizioneAvanzata {
    // composizioneMezziDataArray: MezzoComposizione[];
    // mezziPagination: PaginationInterface;
}

export interface SquadreComposizioneAvanzata {
    dataArray: SquadraComposizione[];
    pagination: PaginationInterface;
}

export interface MezziComposizioneAvanzata {
    dataArray: MezzoComposizione[];
    pagination: PaginationInterface;
}
