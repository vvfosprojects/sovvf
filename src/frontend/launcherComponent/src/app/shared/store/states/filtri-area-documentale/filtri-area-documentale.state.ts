import { Selector, State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { VoceFiltro } from 'src/app/features/home/filterbar/filtri-richieste/voce-filtro.model';

export interface FiltriAreaDocumentaleStateModel {
    filtriAreaDocumentale: VoceFiltro[];
}

export const FiltriAreaDocumentaleModelDefaults: FiltriAreaDocumentaleStateModel = {
    filtriAreaDocumentale: [
        new VoceFiltro('1', 'Tipo Documento', 'Piani Discendenti', false)
    ]
};

@Injectable()
@State<FiltriAreaDocumentaleStateModel>({
    name: 'filtriAreaDocumentale',
    defaults: FiltriAreaDocumentaleModelDefaults
})
export class FiltriAreaDocumentaleState {

    @Selector()
    static filtriAreaDocumentale(state: FiltriAreaDocumentaleStateModel): VoceFiltro[] {
        return state.filtriAreaDocumentale;
    }
}
