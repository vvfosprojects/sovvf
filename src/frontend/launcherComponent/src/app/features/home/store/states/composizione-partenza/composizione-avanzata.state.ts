import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import {
    ClearComposizioneAvanzata, FilterListeComposizioneAvanzata,
    GetListeComposizioneAvanzata,
    SetListeComposizioneAvanzata,
    UnselectMezziAndSquadreComposizioneAvanzata
} from '../../actions/composizione-partenza/composizione-avanzata.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { MezziComposizioneState } from './mezzi-composizione.state';
import { SquadreComposizioneState } from './squadre-composizione.state';
import { ComposizionePartenzaState, ComposizionePartenzaStateModel } from './composizione-partenza.state';
import {
    ClearSelectedMezziComposizione,
    FilterListaMezziComposizioneByFilters,
    SetListaMezziComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import { ClearSelectedSquadreComposizione, SetListaSquadreComposizione } from '../../actions/composizione-partenza/squadre-composizione.actions';
import { ListaComposizioneAvanzata } from '../../../composizione-partenza/interface/lista-composizione-avanzata-interface';
import { BoxPartenzaState } from './box-partenza.state';
import { codDistaccamentoIsEqual, mezzoComposizioneBusy } from '../../../composizione-partenza/shared/functions/composizione-functions';
import { RemoveBoxPartenza } from '../../actions/composizione-partenza/box-partenza.actions';
import { FiltriComposizione } from '../../../composizione-partenza/interface/filtri/filtri-composizione-interface';
import { ViewComponentState } from '../view/view.state';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { GetPreAccoppiati } from '../../actions/composizione-partenza/composizione-veloce.actions';
import { SetListaFiltriAffini, StartListaComposizioneLoading, StopListaComposizioneLoading } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';

export interface ComposizioneAvanzataStateModel {
    listaMezziSquadre: ListaComposizioneAvanzata;
}

export const ComposizioneAvanzataStateDefaults: ComposizioneAvanzataStateModel = {
    listaMezziSquadre: null
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
        this.store.dispatch(new StartListaComposizioneLoading());
        const filtri = {} as FiltriComposizione;
        filtri.idRichiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione) ? this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id : '';

        this.squadreService.getListeComposizioneAvanzata(filtri).subscribe((listeCompAvanzata: ListaComposizioneAvanzata) => {
            if (listeCompAvanzata) {
                const listaBoxPartenza = this.store.selectSnapshot(BoxPartenzaState.boxPartenzaList);
                if (listeCompAvanzata.composizioneMezzi) {
                    listeCompAvanzata.composizioneMezzi.map((mezzo: MezzoComposizione) => {
                        if (mezzo.mezzo.stato === StatoMezzo.OperativoPreaccoppiato) {
                            mezzo.mezzo.stato = StatoMezzo.InSede;
                        }
                    });
                    this.store.dispatch(new SetListaMezziComposizione(listeCompAvanzata.composizioneMezzi));
                }
                if (listeCompAvanzata.composizioneSquadre) {
                    this.store.dispatch(new SetListaSquadreComposizione(listeCompAvanzata.composizioneSquadre));
                }
                this.store.dispatch(new SetListeComposizioneAvanzata(listeCompAvanzata));

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
                                    this.store.dispatch(new RemoveBoxPartenza(box));
                                }
                            });
                        }
                    }
                }
                this.store.dispatch(new StopListaComposizioneLoading());
            }
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
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
        dispatch(new SetListaFiltriAffini());
    }

    @Action(FilterListeComposizioneAvanzata)
    filterListeComposizioneAvanzata({ dispatch }: StateContext<ComposizionePartenzaStateModel>, action: FilterListeComposizioneAvanzata) {
        dispatch(new FilterListaMezziComposizioneByFilters(action.filtri));
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
}
