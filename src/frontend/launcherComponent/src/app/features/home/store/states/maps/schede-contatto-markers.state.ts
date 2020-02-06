import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import {
    AddSchedeContattoMarkers,
    ClearSchedeContattoMarkers, GetSchedeContattoMarkers,
    InsertSchedaContattoMarker,
    OpacizzaSchedeContattoMarkers,
    PatchSchedeContattoMarkers,
    RemoveSchedaContattoMarker,
    SetSchedaContattoMarkerById,
    SetSchedeContattoMarkers, SetTipoOpacitaSchedeContattoMarkers, ToggleOpacitaSchedeContattoMarkers,
    UpdateSchedaContattoMarker
} from '../../actions/maps/schede-contatto-markers.actions';
import { SchedaContattoMarker } from '../../../maps/maps-model/scheda-contatto-marker.model';
import { SetMarkerLoading } from '../../actions/home.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SchedeContattoMarkerService } from '../../../../../core/service/maps-service/schede-contatto-marker/schede-contatto-marker.service';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { ClearMarkerOpachiSC, SetMarkerOpachiSC } from '../../actions/maps/marker-opachi.actions';

export interface SchedeContattoMarkersStateModel {
    schedeContattoMarkers: SchedaContattoMarker[];
    schedeContattoMarkersId: string[];
    schedaContattoMarker: SchedaContattoMarker;
    statoOpacita: boolean;
    tipoOpacita: ClassificazioneSchedaContatto;
}

export const SchedeContattoMarkersStateDefaults: SchedeContattoMarkersStateModel = {
    schedeContattoMarkers: [],
    schedeContattoMarkersId: [],
    schedaContattoMarker: null,
    statoOpacita: false,
    tipoOpacita: null
};

@State<SchedeContattoMarkersStateModel>({
    name: 'schedeContattoMarkers',
    defaults: SchedeContattoMarkersStateDefaults
})

export class SchedeContattoMarkersState {

    @Selector()
    static schedeContattoMarkers(state: SchedeContattoMarkersStateModel) {
        return state.schedeContattoMarkers;
    }

    @Selector()
    static schedeContattoMarkersIds(state: SchedeContattoMarkersStateModel) {
        return state.schedeContattoMarkersId;
    }

    @Selector()
    static getSchedaContattoMarkerById(state: SchedeContattoMarkersStateModel) {
        return state.schedaContattoMarker;
    }

    constructor(private _schedeContatto: SchedeContattoMarkerService) {
    }

    @Action(GetSchedeContattoMarkers)
    getSchedeContattoMarkers({ dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: GetSchedeContattoMarkers) {
        dispatch(new SetMarkerLoading(true));
        this._schedeContatto.getSchedeContattoMarkers(action.areaMappa, action.filtri).subscribe((data: any) => {
                dispatch([
                    new SetSchedeContattoMarkers(data.listaSchedeMarker),
                    new SetMarkerLoading(false)
                ]);
            }, () => dispatch([
                new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5),
                new SetMarkerLoading(false)
            ])
        );
    }

    @Action(SetSchedeContattoMarkers)
    setSchedeContattoMarkers({ getState, dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedeContattoMarkers) {
        const state = getState();
        if (action.schedeContatto) {
            if (state.schedeContattoMarkers.length === 0) {
                dispatch(new PatchSchedeContattoMarkers(action.schedeContatto));
            } else {
                const actionSchedeId: string[] = [];
                const schedeRemoveId: string[] = [];
                const schedeAdd: SchedaContattoMarker[] = [];
                /**
                 * marker da aggiungere
                 */
                action.schedeContatto.forEach(scheda => {
                    actionSchedeId.push(scheda.codiceScheda);
                    if (!state.schedeContattoMarkersId.includes(scheda.codiceScheda)) {
                        schedeAdd.push(scheda);
                    }
                });
                /**
                 * marker da rimuovere
                 */
                state.schedeContattoMarkers.forEach(scheda => {
                    if (!actionSchedeId.includes(scheda.codiceScheda)) {
                        schedeRemoveId.push(scheda.codiceScheda);
                    }
                });
                /**
                 * tolgo i marker dallo stato
                 */
                if (schedeRemoveId.length > 0) {
                    schedeRemoveId.forEach(id => {
                        dispatch(new RemoveSchedaContattoMarker(id));
                    });
                }
                /**
                 * aggiungo i marker allo stato
                 */
                if (schedeAdd.length > 0) {
                    dispatch(new AddSchedeContattoMarkers(schedeAdd));
                }
            }
            if (state.statoOpacita) {
                dispatch(new OpacizzaSchedeContattoMarkers());
            }
        }
    }

    @Action(PatchSchedeContattoMarkers)
    patchSchedeContattoMarkers({ patchState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: PatchSchedeContattoMarkers) {
        patchState({
            schedeContattoMarkers: payload.map((scheda: SchedaContattoMarker) => scheda),
            schedeContattoMarkersId: payload.map((scheda: SchedaContattoMarker) => scheda.codiceScheda)
        });
    }

    @Action(AddSchedeContattoMarkers)
    addSchedeContattoMarkers({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: AddSchedeContattoMarkers) {
        setState(
            patch({
                schedeContattoMarkers: append(payload.map((scheda: SchedaContattoMarker) => scheda)),
                schedeContattoMarkersId: append(payload.map((scheda: SchedaContattoMarker) => scheda.codiceScheda))
            })
        );
    }

    @Action(InsertSchedaContattoMarker)
    insertSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload, before }: InsertSchedaContattoMarker) {
        setState(
            patch({
                schedeContattoMarkers: insertItem(payload, before),
                schedeContattoMarkersId: insertItem(payload.codiceScheda, before)
            })
        );
    }

    @Action(UpdateSchedaContattoMarker)
    updateSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: UpdateSchedaContattoMarker) {
        setState(
            patch({
                schedeContattoMarkers: updateItem<SchedaContattoMarker>((scheda: SchedaContattoMarker) => scheda.codiceScheda === payload.codiceScheda, payload)
            })
        );
    }

    @Action(RemoveSchedaContattoMarker)
    removeSchedaContattoMarker({ setState }: StateContext<SchedeContattoMarkersStateModel>, { payload }: RemoveSchedaContattoMarker) {
        setState(
            patch({
                schedeContattoMarkers: removeItem<SchedaContattoMarker>((scheda: SchedaContattoMarker) => scheda.codiceScheda === payload),
                schedeContattoMarkersId: removeItem<string>(id => id === payload)
            })
        );
    }

    @Action(SetSchedaContattoMarkerById)
    setSchedaContattoMarkerById({ getState, patchState }: StateContext<SchedeContattoMarkersStateModel>, action: SetSchedaContattoMarkerById) {
        const state = getState();
        if (action.id) {
            patchState({
                schedaContattoMarker: state.schedeContattoMarkers.filter((scheda: SchedaContattoMarker) => scheda.codiceScheda === action.id)[0]
            });
        } else {
            patchState({
                schedaContattoMarker: null
            });
        }
    }

    @Action(ToggleOpacitaSchedeContattoMarkers)
    toggleOpacitaSchedaContattoMarkers({ patchState, dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: ToggleOpacitaSchedeContattoMarkers) {
        patchState({
            statoOpacita: action.toggle
        });
        if (!action.toggle) {
            patchState({
                tipoOpacita: SchedeContattoMarkersStateDefaults.tipoOpacita,
            });
            dispatch(new ClearMarkerOpachiSC());
        } else {
            dispatch(new SetTipoOpacitaSchedeContattoMarkers(action.stato));
        }
    }

    @Action(SetTipoOpacitaSchedeContattoMarkers)
    setTipoOpacitaSchedaContattoMarkers({ patchState, dispatch }: StateContext<SchedeContattoMarkersStateModel>, action: SetTipoOpacitaSchedeContattoMarkers) {
        patchState({
            tipoOpacita: action.stato
        });
        dispatch(new OpacizzaSchedeContattoMarkers());
    }

    @Action(OpacizzaSchedeContattoMarkers)
    opacizzaSchedaContattoMarkers({ getState, dispatch }: StateContext<SchedeContattoMarkersStateModel>) {
        const state = getState();
        if (state.statoOpacita && state.tipoOpacita) {
            if (state.schedeContattoMarkers) {
                dispatch(new SetMarkerOpachiSC(idSCFiltrate(state.tipoOpacita, state.schedeContattoMarkers)));
            }
        }
    }

    @Action(ClearSchedeContattoMarkers)
    clearSchedeContattoMarkers({ patchState, dispatch }: StateContext<SchedeContattoMarkersStateModel>) {
        patchState(SchedeContattoMarkersStateDefaults);
        dispatch(new ClearMarkerOpachiSC());
    }

}

export function idSCFiltrate(stato: ClassificazioneSchedaContatto, schedeContatto: SchedaContattoMarker[]): string[] {
    const filteredId: string[] = [];
    schedeContatto.forEach(r => {
        if (r.classificazione === stato) {
            filteredId.push(r.codiceScheda);
        }
    });
    return filteredId;
}
