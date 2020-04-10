import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import {
    ClearComposizioneVeloce,
    ClearPreaccoppiati,
    GetPreAccoppiati,
    GetListaIdPreAccoppiati,
    SelectPreAccoppiatoComposizione,
    SetPreaccoppiati,
    SetListaIdPreAccoppiati,
    UnselectPreAccoppiatoComposizione,
    UpdateMezzoPreAccoppiatoComposizione,
    ClearPreAccoppiatiSelezionatiComposizione,
    HoverInPreAccoppiatoComposizione,
    HoverOutPreAccoppiatoComposizione,
    SetIdPreAccoppiatiOccupati,
    FilterListaPreAccoppiati
} from '../../actions/composizione-partenza/composizione-veloce.actions';
import { CompPartenzaService } from 'src/app/core/service/comp-partenza-service/comp-partenza.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { ComposizioneAvanzataState } from './composizione-avanzata.state';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { makeCopy } from '../../../../../shared/helper/function';
import { IdPreaccoppiati } from '../../../composizione-partenza/interface/id-preaccoppiati-interface';
import { ListaComposizioneAvanzata } from '../../../composizione-partenza/interface/lista-composizione-avanzata-interface';
import { ClearMarkerMezzoHover, SetMarkerMezzoHover } from '../../actions/maps/marker.actions';
import {
    checkSquadraOccupata,
    codDistaccamentoIsEqual,
    mezzoComposizioneBusy
} from '../../../composizione-partenza/shared/functions/composizione-functions';
import produce from 'immer';
import { SetListaFiltriAffini } from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from './composizione-partenza.state';

export interface PreAccoppiatiStateModel {
    allPreAccoppiati: BoxPartenza[];
    preAccoppiati: BoxPartenza[];
    idPreAccoppiati: IdPreaccoppiati[];
    idPreAccoppiatoSelezionato: string;
    idPreAccoppiatiSelezionati: string[];
    idPreAccoppiatiOccupati: string[];
    idPreaccoppiatoHover: string;
}

export const PreAccoppiatiStateModelStateDefaults: PreAccoppiatiStateModel = {
    allPreAccoppiati: null,
    preAccoppiati: null,
    idPreAccoppiati: null,
    idPreAccoppiatoSelezionato: null,
    idPreAccoppiatiSelezionati: [],
    idPreAccoppiatiOccupati: [],
    idPreaccoppiatoHover: null
};

@State<PreAccoppiatiStateModel>({
    name: 'preAccoppiati',
    defaults: PreAccoppiatiStateModelStateDefaults
})
export class ComposizioneVeloceState {

    @Selector()
    static preAccoppiati(state: PreAccoppiatiStateModel) {
        return state.preAccoppiati;
    }

    @Selector()
    static idPreAccoppiatiSelezionati(state: PreAccoppiatiStateModel) {
        return state.idPreAccoppiatiSelezionati;
    }

    @Selector()
    static idPreAccoppiatiOccupati(state: PreAccoppiatiStateModel) {
        return state.idPreAccoppiatiOccupati;
    }

    @Selector()
    static idPreAccoppiatoSelezionato(state: PreAccoppiatiStateModel) {
        return state.idPreAccoppiatoSelezionato;
    }

    @Selector()
    static idPreAccoppiatoHover(state: PreAccoppiatiStateModel) {
        return state.idPreaccoppiatoHover;
    }

    constructor(private preAccoppiatiService: CompPartenzaService,
                private store: Store) {
    }

    @Action(GetPreAccoppiati)
    getPreAccoppiati({ getState, dispatch }: StateContext<PreAccoppiatiStateModel>) {
        const listaMezziSquadre: ListaComposizioneAvanzata = this.store.selectSnapshot(ComposizioneAvanzataState.listaMezziSquadre);
        const state = getState();
        const preaccoppiati: BoxPartenza[] = [];
        if (listaMezziSquadre.composizioneSquadre.length > 0 && listaMezziSquadre.composizioneMezzi.length > 0) {
            state.idPreAccoppiati.forEach((idPreaccopiati: IdPreaccoppiati) => {
                const preaccoppiato = {} as BoxPartenza;
                preaccoppiato.id = idPreaccopiati.id;
                const mezzoComposizione = listaMezziSquadre.composizioneMezzi.filter(value => value.mezzo.codice === idPreaccopiati.mezzo);
                if (mezzoComposizione && mezzoComposizione.length > 0) {
                    preaccoppiato.mezzoComposizione = mezzoComposizione[0];
                }
                const squadreComposizione = listaMezziSquadre.composizioneSquadre.filter(value => idPreaccopiati.squadre.includes(value.squadra.id));
                if (squadreComposizione && squadreComposizione.length > 0) {
                    preaccoppiato.squadraComposizione = squadreComposizione;
                }
                if (preaccoppiato.id && preaccoppiato.mezzoComposizione && preaccoppiato.squadraComposizione) {
                    preaccoppiati.push(preaccoppiato);
                }
            });
        }
        const preaccoppiatiOccupati = [];
        preaccoppiati.forEach(preaccoppiato => {
            if (mezzoComposizioneBusy(preaccoppiato.mezzoComposizione.mezzo.stato) || checkSquadraOccupata(preaccoppiato.squadraComposizione)) {
                preaccoppiatiOccupati.push(preaccoppiato.id);
            }
        });
        dispatch([
            new SetPreaccoppiati(preaccoppiati),
            new SetIdPreAccoppiatiOccupati(preaccoppiatiOccupati)
        ]);
    }

    @Action(SetPreaccoppiati)
    setPreaccoppiati({ getState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: SetPreaccoppiati) {
        if (action.boxPartenza) {
            patchState({
                preAccoppiati: action.boxPartenza,
                allPreAccoppiati: action.boxPartenza
            });
        }
        const filtriSelezionati = this.store.selectSnapshot(ComposizionePartenzaState.filtriSelezionati);
        dispatch(new FilterListaPreAccoppiati(filtriSelezionati));
    }

    @Action(ClearPreaccoppiati)
    clearPreaccoppiati({ patchState }: StateContext<PreAccoppiatiStateModel>) {
        patchState({
            preAccoppiati: null,
            allPreAccoppiati: null
        });
    }


    @Action(SelectPreAccoppiatoComposizione)
    selectPreAccoppiatoComposizione({ setState, getState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: SelectPreAccoppiatoComposizione) {
        // controllo se il mezzo che è all'interno del preAccoppiato non è prenotato
        if (!action.preAcc.mezzoComposizione.istanteScadenzaSelezione) {
            setState(
                patch({
                    idPreAccoppiatiSelezionati: insertItem(action.preAcc.id),
                    idPreAccoppiatoSelezionato: action.preAcc.id
                })
            );
        } else {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile selezionare il Pre-Accoppiato', 'Il mezzo è già presente in un\'altra partenza'));
        }
    }

    @Action(UnselectPreAccoppiatoComposizione)
    unselectPreAccoppiatoComposizione({ setState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: UnselectPreAccoppiatoComposizione) {
        setState(
            patch({
                idPreAccoppiatiSelezionati: removeItem(x => x === action.preAcc.id),
                idPreAccoppiatoSelezionato: null
            })
        );
    }

    @Action(ClearPreAccoppiatiSelezionatiComposizione)
    clearPreAccoppiatiSelezionatiComposizione({ patchState }: StateContext<PreAccoppiatiStateModel>) {
        patchState({
                idPreAccoppiatiSelezionati: PreAccoppiatiStateModelStateDefaults.idPreAccoppiatiSelezionati,
                idPreAccoppiatoSelezionato: PreAccoppiatiStateModelStateDefaults.idPreAccoppiatoSelezionato
            }
        );
    }

    @Action(UpdateMezzoPreAccoppiatoComposizione)
    updateMezzoBoxPartenzaComposizione({ getState, setState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: UpdateMezzoPreAccoppiatoComposizione) {
        const state = getState();
        let preAccoppiato = null;
        state.preAccoppiati.forEach((preAcc: BoxPartenza) => {
            if (preAcc.mezzoComposizione.mezzo.codice === action.codiceMezzo) {
                preAccoppiato = makeCopy(preAcc);
                preAccoppiato.mezzoComposizione = action.codiceMezzo;
            }
        });
        setState(
            patch({
                preAccoppiati: updateItem((preAcc: BoxPartenza) => preAcc.mezzoComposizione.mezzo.codice === action.codiceMezzo, preAccoppiato)
            })
        );
    }

    @Action(ClearComposizioneVeloce)
    clearComposizioneVeloce({ patchState }: StateContext<PreAccoppiatiStateModel>) {
        patchState(PreAccoppiatiStateModelStateDefaults);
    }

    @Action(GetListaIdPreAccoppiati)
    getListaIdPreAccoppiati({ dispatch }: StateContext<PreAccoppiatiStateModel>) {
        this.preAccoppiatiService.getPreAccoppiati().subscribe((data) => {
            this.store.dispatch(new SetListaIdPreAccoppiati(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetListaIdPreAccoppiati)
    setListaIdPreAccoppiati({ patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: SetListaIdPreAccoppiati) {
        if (action && action.idPreaccoppiati) {
            patchState({
                idPreAccoppiati: action.idPreaccoppiati
            });
            dispatch(new GetPreAccoppiati());
        }
    }

    @Action(SetIdPreAccoppiatiOccupati)
    setIdPreAccoppiatiOccupati({ patchState }: StateContext<PreAccoppiatiStateModel>, action: SetIdPreAccoppiatiOccupati) {
        if (action && action.idPreaccoppiatiOccupati) {
            patchState({
                idPreAccoppiatiOccupati: action.idPreaccoppiatiOccupati
            });
        }
    }

    @Action(HoverInPreAccoppiatoComposizione)
    hoverInPreAccoppiatoComposizione({ getState, patchState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: HoverInPreAccoppiatoComposizione) {
        const state = getState();
        patchState({
            idPreaccoppiatoHover: action.idBoxPartenzaHover.idBoxPartenza
        });
        if (!state.idPreAccoppiatiOccupati.includes(action.idBoxPartenzaHover.idBoxPartenza)) {
            dispatch(new SetMarkerMezzoHover(action.idBoxPartenzaHover.idMezzo));
        }
    }

    @Action(HoverOutPreAccoppiatoComposizione)
    hoverOutPreAccoppiatoComposizione({ patchState, dispatch }: StateContext<PreAccoppiatiStateModel>) {
        patchState({
            idPreaccoppiatoHover: null
        });
        dispatch(new ClearMarkerMezzoHover());
    }

    @Action(FilterListaPreAccoppiati)
    filterListaPreAccoppiati({ getState, setState, dispatch }: StateContext<PreAccoppiatiStateModel>, action: FilterListaPreAccoppiati) {
        let state = getState();
        setState(
            produce(state, (draft: PreAccoppiatiStateModel) => {
                draft.preAccoppiati = draft.allPreAccoppiati;

                if (action.filtri) {
                    // CODICE DISTACCAMENTO
                    if (action.filtri.CodiceDistaccamento && action.filtri.CodiceDistaccamento.length > 0) {
                        draft.preAccoppiati = draft.preAccoppiati.filter((p: BoxPartenza) => codDistaccamentoIsEqual(p.mezzoComposizione.mezzo.distaccamento.codice, action.filtri.CodiceDistaccamento[0]));
                    }
                    // CODICE TIPO MEZZO
                    if (action.filtri.TipoMezzo && action.filtri.TipoMezzo.length > 0) {
                        draft.preAccoppiati = draft.preAccoppiati.filter((p: BoxPartenza) => p.mezzoComposizione.mezzo.genere === action.filtri.TipoMezzo[0]);
                    }
                    // CODICE STATO MEZZO
                    if (action.filtri.StatoMezzo && action.filtri.StatoMezzo.length > 0) {
                        draft.preAccoppiati = draft.preAccoppiati.filter((p: BoxPartenza) => p.mezzoComposizione.mezzo.stato === action.filtri.StatoMezzo[0]);
                    }
                }
            })
        );
        state = getState();
        dispatch(new SetListaFiltriAffini(state.preAccoppiati.map((p: BoxPartenza) => p.mezzoComposizione)));
    }
}
