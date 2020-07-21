import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import {
    ClearComposizioneAvanzata,
    FilterListeComposizioneAvanzata,
    GetListeComposizioneAvanzata, ResetRicercaMezziComposizione, ResetRicercaSquadreComposizione,
    SetListeComposizioneAvanzata,
    SetRicercaMezziComposizione,
    SetRicercaSquadreComposizione,
    UnselectMezziAndSquadreComposizioneAvanzata
} from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { ComposizionePartenzaState, ComposizionePartenzaStateModel } from './composizione-partenza.state';
import { ClearSelectedMezziComposizione, FilterListaMezziComposizione, SetListaMezziComposizione } from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { ClearSelectedSquadreComposizione, FilterListaSquadreComposizione, SetListaSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { ListaComposizioneAvanzata } from '../../../composizione-partenza/interface/lista-composizione-avanzata-interface';
import { BoxPartenzaState } from './box-partenza.state';
import { mezzoComposizioneBusy } from '../../../composizione-partenza/shared/functions/composizione-functions';
import { RemoveBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ViewComponentState } from '../view/view.state';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { GetPreAccoppiati } from '../../actions/composizione-partenza/composizione-veloce.actions';
import { StartListaComposizioneLoading, StopListaComposizioneLoading } from '../../actions/composizione-partenza/composizione-partenza.actions';

export interface ComposizioneAvanzataStateModel {
    listaMezziSquadre: ListaComposizioneAvanzata;
    ricercaSquadre: string;
    ricercaMezzi: string;
}

export const ComposizioneAvanzataStateDefaults: ComposizioneAvanzataStateModel = {
    listaMezziSquadre: null,
    ricercaSquadre: undefined,
    ricercaMezzi: undefined
};

@State<ComposizioneAvanzataStateModel>({
    name: 'composizioneAvanzata',
    defaults: ComposizioneAvanzataStateDefaults,
    children: [MezziComposizioneState, SquadreComposizioneState]
})
export class ComposizioneAvanzataState {

    @Selector()
    static listaMezziSquadre(state: ComposizioneAvanzataStateModel) {
        return state.listaMezziSquadre;
    }

    constructor(private squadreService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetListeComposizioneAvanzata)
    getListeComposizioneAvanzata({ dispatch }: StateContext<ComposizioneAvanzataStateModel>) {
        dispatch(new StartListaComposizioneLoading());
        const filtri = {} as FiltriComposizione;
        filtri.idRichiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : '';

        this.squadreService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata) {
                const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                if (listeCompAvanzata.composizioneMezzi) {
                    dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
                }
                if (listeCompAvanzata.composizioneSquadre) {
                    dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
                }
                dispatch(new SetListeComposizioneAvanzata(listeCompAvanzata));

                if (listaBoxPartenza.length > 0) {
                    const listaBoxMezzi = listaBoxPartenza.filter(box => box.mezzoComposizione !== null);
                    if (listaBoxMezzi.length > 0) {
                        const mezziOccupati = [];
                        listeCompAvanzata.composizioneMezzi.forEach(mezzo => {
                            if (mezzoComposizioneBusy(mezzo.mezzo.stato)) {
                                mezziOccupati.push(mezzo.id);
                            }
                        });
                        if (mezziOccupati.length > 0) {
                            listaBoxPartenza.forEach(box => {
                                if (box.mezzoComposizione && mezziOccupati.includes(box.mezzoComposizione.id)) {
                                    dispatch(new RemoveBoxPartenza(box));
                                }
                            });
                        }
                    }
                }
                dispatch(new StopListaComposizioneLoading());
            }
        }, () => {
            dispatch(new StopListaComposizioneLoading());
        });
    }

    @Action(SetListeComposizioneAvanzata)
    setListeComposizioneAvanzata({ patchState, dispatch }: StateContext<ComposizioneAvanzataStateModel>, action: SetListeComposizioneAvanzata) {
        patchState({
            listaMezziSquadre: action.listaMezziSquadre
        });
        const compMode = this.store.selectSnapshot(ViewComponentState.composizioneMode);
        if (compMode === Composizione.Veloce) {
            dispatch(new GetPreAccoppiati());
        }
        const filtriSelezionati = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati);
        dispatch(new FilterListeComposizioneAvanzata(filtriSelezionati));
    }

    @Action(FilterListeComposizioneAvanzata)
    filterListeComposizioneAvanzata({ dispatch }: StateContext<ComposizionePartenzaStateModel>, action: FilterListeComposizioneAvanzata) {
        const squadreComposizione = this.store.selectSnapshot(SquadreComposizioneState.allSquadreComposione);
        const mezziComposizione = this.store.selectSnapshot(MezziComposizioneState.mezziComposizione);
        dispatch(new FilterListaMezziComposizione(null, action.filtri, squadreComposizione));
        dispatch(new FilterListaSquadreComposizione(null, action.filtri, mezziComposizione));
    }

    @Action(UnselectMezziAndSquadreComposizioneAvanzata)
    unselectMezziAndSquadreComposizioneAvanzata({ dispatch }: StateContext<ComposizioneAvanzataStateModel>) {
        dispatch(new ClearSelectedMezziComposizione());
        dispatch(new ClearSelectedSquadreComposizione());
    }

    @Action(ClearComposizioneAvanzata)
    clearComposizioneAvanzata({ patchState }: StateContext<ComposizioneAvanzataStateModel>) {
        patchState(ComposizioneAvanzataStateDefaults);
    }

    @Action(SetRicercaSquadreComposizione)
    setRicercaSquadreComposizione({ patchState }: StateContext<ComposizioneAvanzataStateModel>, action: SetRicercaSquadreComposizione) {
        patchState({
            ricercaSquadre: action.ricerca
        });
    }

    @Action(ResetRicercaSquadreComposizione)
    resetRicercaSquadreComposizione({ patchState }: StateContext<ComposizioneAvanzataStateModel>) {
        patchState({
            ricercaSquadre: ComposizioneAvanzataStateDefaults.ricercaSquadre
        });
    }

    @Action(SetRicercaMezziComposizione)
    setRicercaMezziComposizione({ patchState }: StateContext<ComposizioneAvanzataStateModel>, action: SetRicercaMezziComposizione) {
        patchState({
            ricercaMezzi: action.ricerca
        });
    }

    @Action(ResetRicercaMezziComposizione)
    resetRicercaMezziComposizione({ patchState }: StateContext<ComposizioneAvanzataStateModel>) {
        patchState({
            ricercaMezzi: ComposizioneAvanzataStateDefaults.ricercaMezzi
        });
    }
}
