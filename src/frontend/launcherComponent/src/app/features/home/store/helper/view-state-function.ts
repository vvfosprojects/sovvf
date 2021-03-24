import { Grids, ViewComponentStateModel, ViewInterfaceButton, ViewInterfaceMaps } from '../../../../shared/interface/view.interface';
import { ChangeView } from '../actions/view/view.actions';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { Grid } from '../../../../shared/enum/layout.enum';
import { Composizione } from '../../../../shared/enum/composizione.enum';

/**
 * partendo dallo stato di default, cambia lo stato di visualizzazione dell'applicazione in 3 differenti modalità
 * @param: stateDefault
 * @param: action
 */
export function updateView(stateDefault: any, action: ChangeView): ViewComponentStateModel {
    if (action.modalita !== AppFeatures.Default) {
        stateDefault.view.richieste.split = false;
        stateDefault.view.mappa.split = false;
        stateDefault.column = gridSolve(action.modalita);
    }
    switch (action.modalita) {
        case AppFeatures.Mappa:
            stateDefault.view.richieste.active = false;
            stateDefault.view.mappa.active = true;
            break;
        case AppFeatures.Richieste:
            stateDefault.view.mappa.active = false;
            stateDefault.view.richieste.active = true;
            break;
        default:
            break;
    }
    return stateDefault;
}

/**
 * partendo dallo stato di default, cambia lo stato di visualizzazione di chiamata
 * @param: stateDefault
 */
export function activeChiamata(stateDefault: any): ViewComponentStateModel {
    stateDefault.view.richieste.active = false;
    stateDefault.view.chiamata.active = true;
    stateDefault.view.mappa.options = [AppFeatures.Chiamata];
    stateDefault.view.filterbar.options = [Grid.Col6];
    return stateDefault;
}

/**
 * partendo dallo stato di default, cambia lo stato di visualizzazione di composizionePartenza
 * @param: stateDefault
 * @param: modalita
 */
export function activeComposizione(stateDefault: any, modalita: Composizione): ViewComponentStateModel {
    stateDefault.view.richieste.active = false;
    stateDefault.view.composizione.active = true;
    stateDefault.view.composizione.options = [modalita];
    stateDefault.view.mappa.options = [AppFeatures.ComposizionePartenza];
    stateDefault.view.filterbar.options = [Grid.Col6];
    return stateDefault;
}

/**
 * partendo dallo stato attuale, cambia la modalità di composizionePartenza
 * @param: state
 * @param: modalita
 */
export function switchComposizione(state: any, modalita: Composizione): ViewComponentStateModel {
    state.view.composizione.options = [modalita];
    return state;
}

/**
 * partendo dallo stato attuale di Composizione, torno a Richieste e verifico la modalità dallo stato salvato
 * @param: state
 * @param: lastState
 */
export function turnOffComposizione(state: any, lastState: ViewComponentStateModel): ViewComponentStateModel {
    if (lastState.column.sinistra === Grid.No && !lastState.view.richieste.split) {
        state.view.mappa.active = false;
        state.view.richieste.split = false;
        state.view.mappa.split = false;
        state.column = gridSolve(AppFeatures.Richieste);
    }
    state.view.richieste.active = true;
    state.view.composizione.active = false;
    state.view.mappa.options = [AppFeatures.Richieste];
    state.view.filterbar.options = [Grid.Col5];
    return state;
}

/**
 * partendo dallo stato attuale di Composizione, torno a Richieste e verifico la modalità dallo stato salvato
 * @param: state
 * @param: lastState
 */
export function turnOffModifica(state: any, lastState: ViewComponentStateModel): ViewComponentStateModel {
    if (lastState.column.sinistra === Grid.No && !lastState.view.richieste.split) {
        state.view.mappa.active = false;
        state.view.richieste.split = false;
        state.view.mappa.split = false;
        state.column = gridSolve(AppFeatures.Richieste);
    }
    state.view.richieste.active = true;
    state.view.modifica.active = false;
    state.view.mappa.options = [AppFeatures.Richieste];
    state.view.filterbar.options = [Grid.Col5];
    return state;
}

/**
 * partendo dallo stato attuale, ritorna lo stato dei button Chiamata e ViewMode
 * @param: state
 */
export function colorButton(state: any): ViewInterfaceButton {
    return {
        chiamata: state.view.chiamata.active ? 'btn-danger' : 'btn-outline-success',
        buttonView: [
            state.view.richieste.active && !state.view.richieste.split ? 'btn-secondary' : 'btn-outline-secondary',
            state.view.richieste.split && state.view.mappa.split ? 'btn-secondary' : 'btn-outline-secondary',
            state.view.mappa.active && !state.view.mappa.split ? 'btn-secondary' : 'btn-outline-secondary'
        ]
    } as ViewInterfaceButton;
}

/**
 * partendo dallo stato attuale, ritorna lo stato di visualizzazione attivo del componente maps
 * @param: state
 */
export function viewStateMaps(state: any): ViewInterfaceMaps {
    return {
        active: state.view.mappa.options[0]
    } as ViewInterfaceMaps;
}

/**
 * funzione helper che assegna le corrette classi di bootstrap
 * @param: feature
 */
export function gridSolve(feature: AppFeatures): Grids {
    const grids = {} as Grids;
    switch (feature) {
        case AppFeatures.Mappa:
            grids.sinistra = Grid.No;
            grids.destra = Grid.Col12;
            break;
        case AppFeatures.Richieste:
            grids.destra = Grid.No;
            grids.sinistra = Grid.Col12;
            break;
        default:
            return;
    }
    return grids;
}

/**
 * partendo dallo stato di default, cambia lo stato di visualizzazione di modifica
 * @param: stateDefault
 */
export function activeModifica(stateDefault: any): ViewComponentStateModel {
    stateDefault.view.richieste.active = false;
    stateDefault.view.modifica.active = true;
    stateDefault.view.mappa.options = [AppFeatures.Modifica];
    return stateDefault;
}

/**
 * partendo dallo stato di default, cambia lo stato di visualizzazione di mezziInServizio
 * @param: stateDefault
 */
export function activeMezziInServizio(stateDefault: any): ViewComponentStateModel {
    stateDefault.view.richieste.active = false;
    stateDefault.view.mezziInServizio.active = true;
    stateDefault.view.mappa.options = [AppFeatures.MezziInServizio];
    return stateDefault;
}

/**
 * partendo dallo stato di default, cambia lo stato di visualizzazione di schedeContatto
 * @param: stateDefault
 */
export function activeSchedeContatto(stateDefault: any): ViewComponentStateModel {
    stateDefault.view.richieste.active = false;
    stateDefault.view.schedeContatto.active = true;
    stateDefault.view.mappa.options = [AppFeatures.SchedeContatto];
    stateDefault.view.filterbar.options = [Grid.Col5];
    return stateDefault;
}
