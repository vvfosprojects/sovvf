import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Action
import {
    ActionMezzo, ActionRichiesta,
    AddRichiesta, CambiaStatoRichiesta, ClearIdChiamataInviaPartenza, ClearRichiestaById,
    ClearRichieste,
    GetRichieste,
    PatchRichiesta,
    SetIdChiamataInviaPartenza, SetRichiestaById,
    SetRichieste,
    StartInviaPartenzaFromChiamata,
    UpdateRichiesta
} from '../../actions/richieste/richieste.actions';

// Service
import { SintesiRichiesteService } from 'src/app/core/service/lista-richieste-service/lista-richieste.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { RichiestaFissataState } from './richiesta-fissata.state';
import { RichiestaHoverState } from './richiesta-hover.state';
import { RichiestaSelezionataState } from './richiesta-selezionata.state';
import { RichiestaModificaState } from './richiesta-modifica.state';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SuccessRichiestaModifica } from '../../actions/richieste/richiesta-modifica.actions';
import {
    RichiestaComposizione,
    UpdateRichiestaComposizione
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ToggleComposizione } from '../../actions/view/view.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { SetMarkerRichiestaSelezionato } from '../../actions/maps/marker.actions';
import { ComposizionePartenzaState } from '../composizione-partenza/composizione-partenza.state';
import { ClearRichiesteEspanse } from '../../actions/richieste/richieste-espanse.actions';
import { RichiesteEspanseState } from './richieste-espanse.state';
import { calcolaActionSuggeritaMezzo } from '../../../../../shared/helper/function';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { RichiestaAttivitaUtenteState } from './richiesta-attivita-utente.state';

export interface RichiesteStateModel {
    richieste: SintesiRichiesta[];
    richiestaById: SintesiRichiesta;
    chiamataInviaPartenza: string;
}

export const RichiesteStateDefaults: RichiesteStateModel = {
    richieste: [],
    richiestaById: null,
    chiamataInviaPartenza: null
};

@State<RichiesteStateModel>({
    name: 'richieste',
    defaults: RichiesteStateDefaults,
    children: [RichiestaFissataState,
        RichiestaHoverState,
        RichiestaSelezionataState,
        RichiestaModificaState,
        RichiesteEspanseState,
        RichiestaGestioneState,
        RichiestaAttivitaUtenteState]
})
export class RichiesteState {

    // SELECTORS
    @Selector()
    static richieste(state: RichiesteStateModel) {
        return state.richieste;
    }

    @Selector()
    static getRichiestaById(state: RichiesteStateModel) {
        return state.richiestaById;
    }

    @Selector()
    static richiestaById(state: RichiesteStateModel) {
        return (id: string) => state.richieste.find(x => x.id === id);
    }

    constructor(private richiesteService: SintesiRichiesteService,
                private store: Store) {
    }

    @Action(GetRichieste, { cancelUncompleted: true })
    getRichieste({ dispatch }: StateContext<RichiesteStateModel>, action: GetRichieste) {
        this.richiesteService.getRichieste(action.idUltimaRichiesta).subscribe((data: SintesiRichiesta[]) => {
            dispatch(new SetRichieste(data));
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(PatchRichiesta)
    patchRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: PatchRichiesta) {
        this.richiesteService.patchRichiesta(action.richiesta).subscribe(() => {
            dispatch(new SuccessRichiestaModifica);
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetRichieste)
    setRichieste({ patchState }: StateContext<RichiesteStateModel>, action: SetRichieste) {
        patchState({
            richieste: action.richieste
        });
    }

    @Action(ClearRichieste)
    clearRichieste({ patchState, dispatch }: StateContext<RichiesteStateModel>) {
        dispatch(new ClearRichiesteEspanse());
        patchState(RichiesteStateDefaults);
    }

    @Action(UpdateRichiesta)
    updateRichiesta({ setState, dispatch }: StateContext<RichiesteStateModel>, { richiesta }: UpdateRichiesta) {
        // Controllo se la richiesta aggiornata è anche la richiesta attualmente in composzione
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        if (richiestaComposizione && richiestaComposizione.id === richiesta.id) {
            // console.log('richiesta', richiesta);
            dispatch(new UpdateRichiestaComposizione(richiesta));
            // dispatch(new ClearBoxPartenze());
            // dispatch(new AddBoxPartenza());
        }
        if (richiesta) {
            setState(
                patch({
                    richieste: updateItem<SintesiRichiesta>(r => r.id === richiesta.id, richiesta)
                })
            );
        }
    }

    @Action(AddRichiesta)
    addRichiesta({ getState, setState, dispatch }: StateContext<RichiesteStateModel>, { richiesta }: AddRichiesta) {
        const state = getState();
        const beforePosition = state.richieste.length > 0 ? 0 : null;
        setState(
            patch({
                richieste: insertItem(richiesta, beforePosition)
            })
        );
        if (state.chiamataInviaPartenza) {
            if (richiesta && richiesta.id === state.chiamataInviaPartenza) {
                setTimeout(() => {
                    dispatch(new StartInviaPartenzaFromChiamata(richiesta));
                });
            }
        }
    }

    @Action(CambiaStatoRichiesta)
    cambiaStatoRichiesta({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: CambiaStatoRichiesta) {
        const obj = {
            'idRichiesta': action.idRichiesta,
            'stato': action.stato
        };
        this.richiesteService.aggiornaStatoRichiesta(obj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore Aggiornamento Stato Richiesta', 'Il server web non risponde', 5)));
    }

    @Action(SetIdChiamataInviaPartenza)
    setIdChiamataInviaPartenza({ patchState }: StateContext<RichiesteStateModel>, action: SetIdChiamataInviaPartenza) {
        patchState({
            chiamataInviaPartenza: action.chiamataInviaPartenza
        });
    }

    @Action(ClearIdChiamataInviaPartenza)
    clearIdChiamataInviaPartenza({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            chiamataInviaPartenza: RichiesteStateDefaults.chiamataInviaPartenza
        });
    }

    @Action(StartInviaPartenzaFromChiamata)
    startInviaPartenzaFromChiamata({ dispatch, patchState }: StateContext<RichiesteStateModel>, action: StartInviaPartenzaFromChiamata) {
        dispatch([
            new ToggleComposizione(Composizione.Avanzata),
            new SetMarkerRichiestaSelezionato(action.richiesta.id),
            new RichiestaComposizione(action.richiesta),
            new ClearIdChiamataInviaPartenza()
        ]);
    }

    @Action(ActionMezzo)
    actionMezzo({ dispatch }: StateContext<RichiesteStateModel>, action: ActionMezzo) {
        const obj = {
            'chiamata': action.mezzoAction.richiesta,
            'idMezzo': action.mezzoAction.mezzo.codice,
            'statoMezzo': action.mezzoAction.action ? action.mezzoAction.action : calcolaActionSuggeritaMezzo(action.mezzoAction.mezzo),
            // 'listaMezzi': action.mezzoAction.listaMezzi ? true : false
        };
        console.log('Obj', obj);
        this.richiesteService.aggiornaStatoMezzo(obj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(ActionRichiesta)
    actionRichiesta({ dispatch }: StateContext<RichiesteStateModel>, action: ActionRichiesta) {
        const obj = action.richiestaAction;
        console.log('Obj', obj);
        this.richiesteService.aggiornaStatoRichiesta(obj).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(SetRichiestaById)
    setRichiestaById({ patchState, dispatch }: StateContext<RichiesteStateModel>, action: SetRichiestaById) {
        this.richiesteService.getRichiestaById(action.idRichiesta).subscribe((data: SintesiRichiesta) => {
            patchState({
                richiestaById: data
            });
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(ClearRichiestaById)
    clearRichiestaById({ patchState }: StateContext<RichiesteStateModel>) {
        patchState({
            richiestaById: RichiesteStateDefaults.richiestaById
        });
    }

}
