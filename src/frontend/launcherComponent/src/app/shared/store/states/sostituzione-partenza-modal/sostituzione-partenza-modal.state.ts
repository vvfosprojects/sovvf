import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetListaMezziSquadre, SetListaMezziSquadre, StartListaComposizioneLoading, StopListaComposizioneLoading } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaComposizioneAvanzata } from '../../../interface/lista-composizione-avanzata-interface';
import { CompPartenzaService } from '../../../../core/service/comp-partenza-service/comp-partenza.service';
import { FilterListaMezziComposizione, SetListaMezziComposizione } from '../../actions/mezzi-composizione/mezzi-composizione.actions';
import { SetListaSquadreComposizione } from '../../actions/squadre-composizione/squadre-composizione.actions';
import { FiltriListaComposizioneAvanzata } from 'src/app/shared/interface/filtri-lista-composizione-avanzata.interface';
import { Injectable } from '@angular/core';

export interface SostituzionePartenzaModel {
    listaMezziSquadre: ListaComposizioneAvanzata;
    sostituzionePartenzaForm: {
        model?: {
            motivazioneAnnullamento: string
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
    loadingListe: boolean;
}

export const sostituzionePartenzaDefaults: SostituzionePartenzaModel = {
    listaMezziSquadre: null,
    sostituzionePartenzaForm: {
        model: {
            motivazioneAnnullamento: undefined
        },
        dirty: false,
        status: '',
        errors: {}
    },
    loadingListe: false
};

@Injectable()
@State<SostituzionePartenzaModel>({
    name: 'sostituzionePartenza',
    defaults: sostituzionePartenzaDefaults
})
export class SostituzionePartenzaModalState {

    @Selector()
    static formValid(state: SostituzionePartenzaModel) {
        return state.sostituzionePartenzaForm.status !== 'INVALID';
    }

    @Selector()
    static loadingListe(state: SostituzionePartenzaModel) {
        return state.loadingListe;
    }

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetListaMezziSquadre)
    getListaMezziSquadre({ dispatch }: StateContext<SostituzionePartenzaModel>, action: GetListaMezziSquadre) {
        // dispatch(new StartListaComposizioneLoading());
        const obj = {} as FiltriListaComposizioneAvanzata;
        obj.idRichiesta = action.idRichiesta;
        this.compPartenzaService.getListeComposizioneAvanzata(obj).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata.composizioneMezziDataArray) {
                dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezziDataArray));
            }
            if (listeCompAvanzata.composizioneSquadreDataArray) {
                dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadreDataArray));
            }
            dispatch(new SetListaMezziSquadre(listeCompAvanzata));
            // dispatch(new StopListaComposizioneLoading());
        }, () => {
            // dispatch(new StopListaComposizioneLoading());
        });
    }

    @Action(SetListaMezziSquadre)
    setListaMezziSquadre({ patchState, dispatch }: StateContext<SostituzionePartenzaModel>, action: SetListaMezziSquadre) {
        patchState({
            listaMezziSquadre: action.listaMezziSquadre
        });
        dispatch(new FilterListaMezziComposizione());
    }


    @Action(StartListaComposizioneLoading)
    startListaComposizioneLoading({ patchState }: StateContext<SostituzionePartenzaModel>) {
        patchState({
            loadingListe: true
        });
    }

    @Action(StopListaComposizioneLoading)
    stopListaComposizioneLoading({ patchState }: StateContext<SostituzionePartenzaModel>) {
        patchState({
            loadingListe: false
        });
    }
}
