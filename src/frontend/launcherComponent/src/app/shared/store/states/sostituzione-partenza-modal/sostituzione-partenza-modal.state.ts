import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetListaMezziSquadre, SetListaMezziSquadre, StartListaComposizioneLoading, StopListaComposizioneLoading } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaComposizioneAvanzata } from '../../../interface/lista-composizione-avanzata-interface';
import { CompPartenzaService } from '../../../../core/service/comp-partenza-service/comp-partenza.service';
import { FiltriComposizione } from '../../../../features/home/composizione-partenza/interface/filtri/filtri-composizione-interface';
import { FilterListaMezziComposizione, SetListaMezziComposizione } from '../../actions/mezzi-composizione/mezzi-composizione.actions';
import { SetListaSquadreComposizione } from '../../actions/squadre-composizione/squadre-composizione.actions';
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
    static formValid(state: SostituzionePartenzaModel): boolean {
        return state.sostituzionePartenzaForm.status !== 'INVALID';
    }

    @Selector()
    static loadingListe(state: SostituzionePartenzaModel): boolean {
        return state.loadingListe;
    }

    constructor(private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetListaMezziSquadre)
    getListaMezziSquadre({ dispatch }: StateContext<SostituzionePartenzaModel>, action: GetListaMezziSquadre): void {
        // dispatch(new StartListaComposizioneLoading());
        const filtri = {} as FiltriComposizione;
        filtri.idRichiesta = action.idRichiesta;
        this.compPartenzaService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata.composizioneMezzi) {
                dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
            }
            if (listeCompAvanzata.composizioneSquadre) {
                dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
            }
            dispatch(new SetListaMezziSquadre(listeCompAvanzata));
            // dispatch(new StopListaComposizioneLoading());
        }, () => {
            // dispatch(new StopListaComposizioneLoading());
        });
    }

    @Action(SetListaMezziSquadre)
    setListaMezziSquadre({ patchState, dispatch }: StateContext<SostituzionePartenzaModel>, action: SetListaMezziSquadre): void {
        patchState({
            listaMezziSquadre: action.listaMezziSquadre
        });
        dispatch(new FilterListaMezziComposizione());
    }


    @Action(StartListaComposizioneLoading)
    startListaComposizioneLoading({ patchState }: StateContext<SostituzionePartenzaModel>): void {
        patchState({
            loadingListe: true
        });
    }

    @Action(StopListaComposizioneLoading)
    stopListaComposizioneLoading({ patchState }: StateContext<SostituzionePartenzaModel>): void {
        patchState({
            loadingListe: false
        });
    }
}
