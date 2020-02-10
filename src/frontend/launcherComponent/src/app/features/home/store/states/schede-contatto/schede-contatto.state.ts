import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    ClearFiltriSchedeContatto,
    ClearListaSchedeContatto,
    ClearSchedaContattoHover,
    ClearSchedaContattoTelefonata,
    GeneraListaSchedeContatto,
    GetListaSchedeContatto, InsertSchedeContatto, OpenDetailSC,
    ReducerSetFiltroSchedeContatto,
    RemoveSchedeContatto,
    ResetFiltriSelezionatiSchedeContatto,
    SaveMergeSchedeContatto,
    SetContatoriSchedeContatto,
    SetFiltroGestitaSchedeContatto,
    SetFiltroKeySchedeContatto,
    SetFiltroSelezionatoSchedaContatto, SetIdVisualizzati,
    SetListaSchedeContatto,
    SetRangeVisualizzazioneSchedeContatto,
    SetSchedaContattoGestita,
    SetSchedaContattoHover,
    SetSchedaContattoTelefonata, SetTabAttivo, ToggleCollapsed, UndoMergeSchedeContatto,
    UpdateSchedaContatto
} from '../../actions/schede-contatto/schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { SchedeContattoService } from '../../../../../core/service/schede-contatto/schede-contatto.service';
import { FiltriSchedeContatto } from '../../../../../shared/interface/filtri-schede-contatto.interface';
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';
import { makeCopy } from '../../../../../shared/helper/function';
import {
    resetFiltriSelezionati as _resetFiltriSelezionati,
    setFiltroSelezionato as _setFiltroSelezionato
} from '../../../../../shared/helper/function-filtro';
import { CategoriaFiltriSchedeContatto as Categoria } from '../../../../../shared/enum/categoria-filtri-schede-contatto';
import { ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { ContatoriSchedeContattoModel } from '../../../../../shared/model/contatori-schede-contatto.model';
import { append, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { RangeSchedeContattoEnum } from '../../../../../shared/enum/range-schede-contatto';
import { MergeSchedeContattoState } from './merge-schede-contatto.state';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import {
    ClearMergeSchedeContatto
} from '../../actions/schede-contatto/merge-schede-contatto.actions';
import { ToggleOpacitaSchedeContattoMarkers } from '../../actions/maps/schede-contatto-markers.actions';
import { DettaglioSchedaModalComponent } from '../../../schede-contatto/dettaglio-scheda-modal/dettaglio-scheda-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone } from '@angular/core';
import { ClearMarkerSCSelezionato } from '../../actions/maps/marker.actions';

export interface SchedeContattoStateModel {
    contatoriSchedeContatto: ContatoriSchedeContatto;
    schedeContatto: SchedaContatto[];
    idSchedeContattoCompetenza: string[];
    idSchedeContattoConoscenza: string[];
    idSchedeContattoDifferibili: string[];
    schedaContattoTelefonata: SchedaContatto;
    codiceSchedaContattoHover: string;
    filtriSchedeContatto: VoceFiltro[];
    filtriSelezionati: FiltriSchedeContatto;
    tabAttivo: ClassificazioneSchedaContatto;
    idVisualizzati: string[];
    idCollapsed: string[];
}

export const SchedeContattoEmpty = {
    schedeContatto: [],
    idSchedeContattoCompetenza: [],
    idSchedeContattoConoscenza: [],
    idSchedeContattoDifferibili: [],
    tabAttivo: null,
    idVisualizzati: [],
    idCollapsed: []
};

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
    contatoriSchedeContatto: new ContatoriSchedeContattoModel(),
    ...SchedeContattoEmpty,
    schedaContattoTelefonata: null,
    codiceSchedaContattoHover: null,
    filtriSchedeContatto: [
        new VoceFiltro('1', Categoria.Gestione, 'Gestita', false),
        new VoceFiltro('2', Categoria.Gestione, 'Non Gestita', false)
        // new VoceFiltro('4', Categoria.Appartenenza, 'Personali', false),
        // new VoceFiltro('4', Categoria.Appartenenza, 'Non Personali', false)
    ],
    filtriSelezionati: {
        testoLibero: '',
        gestita: null,
        rangeVisualizzazione: RangeSchedeContattoEnum.DaSempre
    }
};

@State<SchedeContattoStateModel>({
    name: 'schedeContatto',
    defaults: SchedeContattoStateDefaults,
    children: [ MergeSchedeContattoState ]
})
export class SchedeContattoState {

    @Selector()
    static contatoreSchedeContattoTotale(state: SchedeContattoStateModel) {
        return state.contatoriSchedeContatto.totaleSchede;
    }

    @Selector()
    static contatoriSchedeContatto(state: SchedeContattoStateModel) {
        return state.contatoriSchedeContatto;
    }

    @Selector()
    static schedeContatto(state: SchedeContattoStateModel) {
        return state.schedeContatto;
    }

    @Selector()
    static idSchedeCompetenza(state: SchedeContattoStateModel) {
        return state.idSchedeContattoCompetenza;
    }

    @Selector()
    static idSchedeConoscenza(state: SchedeContattoStateModel) {
        return state.idSchedeContattoConoscenza;
    }

    @Selector()
    static idSchedeDifferibili(state: SchedeContattoStateModel) {
        return state.idSchedeContattoDifferibili;
    }

    @Selector()
    static idVisualizzati(state: SchedeContattoStateModel) {
        return state.idVisualizzati;
    }

    @Selector()
    static idCollapsed(state: SchedeContattoStateModel) {
        return state.idCollapsed;
    }

    @Selector()
    static schedaContattoTelefonata(state: SchedeContattoStateModel) {
        return state.schedaContattoTelefonata;
    }

    @Selector()
    static numeroSchedeContattoCompetenza(state: SchedeContattoStateModel) {
        return state.idSchedeContattoCompetenza.length;
    }

    @Selector()
    static codiceSchedaContattoHover(state: SchedeContattoStateModel) {
        return state.codiceSchedaContattoHover;
    }

    @Selector()
    static filtriSchedeContatto(state: SchedeContattoStateModel) {
        return state.filtriSchedeContatto;
    }

    @Selector()
    static filtriSelezionati(state: SchedeContattoStateModel) {
        return state.filtriSchedeContatto.filter(f => f.selezionato === true);
    }

    @Selector()
    static ricerca(state: SchedeContattoStateModel) {
        return state.filtriSelezionati.testoLibero;
    }

    @Selector()
    static rangeVisualizzazione(state: SchedeContattoStateModel) {
        return state.filtriSelezionati.rangeVisualizzazione;
    }

    @Selector()
    static tabAttivo(state: SchedeContattoStateModel) {
        if (state.tabAttivo) {
            return state.tabAttivo;
        } else {
            return 'Tutte';
        }
    }

    constructor(private schedeContattoService: SchedeContattoService,
                private modal: NgbModal,
                private ngZone: NgZone) {
    }

    @Action(SetContatoriSchedeContatto)
    setContatoriSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetContatoriSchedeContatto) {
        patchState({
            contatoriSchedeContatto: action.contatori
        });
    }

    @Action(GetListaSchedeContatto)
    getListaSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>) {
        const state = getState();
        const filtri = {
            testoLibero: state.filtriSelezionati.testoLibero,
            gestita: state.filtriSelezionati.gestita
        } as FiltriSchedeContatto;
        if (state.filtriSelezionati.rangeVisualizzazione !== RangeSchedeContattoEnum.DaSempre) {
            switch (state.filtriSelezionati.rangeVisualizzazione) {
                case RangeSchedeContattoEnum.UltimaOra:
                    filtri.rangeVisualizzazione = 1;
                    break;
                case RangeSchedeContattoEnum.UltimeDueOre:
                    filtri.rangeVisualizzazione = 2;
                    break;
                case RangeSchedeContattoEnum.UltimoGiorno:
                    filtri.rangeVisualizzazione = 24;
                    break;
            }
        }
        this.schedeContattoService.getSchedeContatto(filtri).subscribe((schedeContatto: SchedaContatto[]) => {
            dispatch(new SetListaSchedeContatto(schedeContatto));
        });
    }

    @Action(SetListaSchedeContatto)
    setListaSchedeContatto({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto) {
        patchState({
            schedeContatto: action.schedeContatto
        });
        dispatch(new GeneraListaSchedeContatto());
    }

    @Action(GeneraListaSchedeContatto)
    generaListaSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>) {
        const state = getState();
        patchState({
            idSchedeContattoCompetenza: state.schedeContatto.filter(scheda => scheda.classificazione === ClassificazioneSchedaContatto.Competenza).map(value => value.codiceScheda),
            idSchedeContattoConoscenza: state.schedeContatto.filter(scheda => scheda.classificazione === ClassificazioneSchedaContatto.Conoscenza).map(value => value.codiceScheda),
            idSchedeContattoDifferibili: state.schedeContatto.filter(scheda => scheda.classificazione === ClassificazioneSchedaContatto.Differibile).map(value => value.codiceScheda)
        });
        dispatch(new SetIdVisualizzati());
    }

    @Action(ClearListaSchedeContatto)
    clearListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState(SchedeContattoEmpty);
    }

    @Action(UpdateSchedaContatto)
    updateSchedaContatto({ setState }: StateContext<SchedeContattoStateModel>, action: UpdateSchedaContatto) {
        setState(
            patch({
                schedeContatto: updateItem<SchedaContatto>(s => s.codiceScheda === action.schedaContatto.codiceScheda, action.schedaContatto)
            })
        );
    }

    @Action(InsertSchedeContatto)
    insertSchedeContatto({ setState, dispatch }: StateContext<SchedeContattoStateModel>, action: InsertSchedeContatto) {
        setState(
            patch({
                schedeContatto: append(<SchedaContatto[]>(action.schedaContatto))
            })
        );
        dispatch(new GeneraListaSchedeContatto());
    }

    @Action(RemoveSchedeContatto)
    removeSchedeContatto({ setState }: StateContext<SchedeContattoStateModel>, { idSchedeRimosse }: RemoveSchedeContatto) {
        console.log(idSchedeRimosse);
        idSchedeRimosse.forEach(idScheda => {
            setState(
                patch({
                    schedeContatto: removeItem<SchedaContatto>(scheda => scheda.codiceScheda === idScheda),
                    idSchedeContattoCompetenza: removeItem<string>(id => id === idScheda),
                    idSchedeContattoConoscenza: removeItem<string>(id => id === idScheda),
                    idSchedeContattoDifferibili: removeItem<string>(id => id === idScheda),
                    idVisualizzati: removeItem<string>(id => id === idScheda)
                })
            );
        });

    }

    @Action(SetTabAttivo)
    setTabAttivo({ patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetTabAttivo) {
        if (action.tabAttivo) {
            patchState({
                tabAttivo: action.tabAttivo,
            });
            dispatch(new ToggleOpacitaSchedeContattoMarkers(true, action.tabAttivo));
        } else {
            patchState({
                tabAttivo: SchedeContattoStateDefaults.tabAttivo,
            });
            dispatch(new ToggleOpacitaSchedeContattoMarkers(false));
        }
        dispatch(new SetIdVisualizzati());
    }

    @Action(SetIdVisualizzati)
    setIdVisualizzati({ getState, patchState }: StateContext<SchedeContattoStateModel>) {
        const state = getState();
        if (state.tabAttivo) {
            patchState({
                idVisualizzati: state.schedeContatto.filter(scheda => scheda.classificazione === state.tabAttivo).map(value => value.codiceScheda)
            });
        } else {
            patchState({
                idVisualizzati: [ ...state.idSchedeContattoCompetenza, ...state.idSchedeContattoConoscenza, ...state.idSchedeContattoDifferibili ]
            });
        }
    }

    @Action(ToggleCollapsed)
    toggleCollapsed({ getState, setState }: StateContext<SchedeContattoStateModel>, action: ToggleCollapsed) {
        const state = getState();
        if (state.idCollapsed.length === 0 || !state.idCollapsed.includes(action.codiceScheda)) {
            setState(
                patch({
                    idCollapsed: insertItem<string>(action.codiceScheda)
                })
            );
        } else {
            setState(
                patch({
                    idCollapsed: removeItem<string>(id => id === action.codiceScheda)
                })
            );
        }
    }

    @Action(SetSchedaContattoGestita)
    setSchedaContattoGestita({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoGestita) {
        this.schedeContattoService.setSchedaContattoGestita(action.codiceScheda, action.gestita).subscribe(() => {
            console.log('setSchedaContattoGestita api response');
        });
    }

    @Action(SetSchedaContattoTelefonata)
    setSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoTelefonata) {
        patchState({
            schedaContattoTelefonata: action.schedaContatto
        });
    }

    @Action(ClearSchedaContattoTelefonata)
    clearSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState({
            schedaContattoTelefonata: null
        });
    }

    @Action(SetSchedaContattoHover)
    setSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoHover) {
        patchState({
            codiceSchedaContattoHover: action.codiceSchedaContatto
        });
    }

    @Action(ClearSchedaContattoHover)
    clearSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState({
            codiceSchedaContattoHover: null
        });
    }

    @Action(ReducerSetFiltroSchedeContatto)
    reducerSetFiltroSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: ReducerSetFiltroSchedeContatto) {
        const state = getState();
        switch (action.filtro.codice) {
            case '1':
                state.filtriSelezionati.gestita === true ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(true));
                break;
            case '2':
                state.filtriSelezionati.gestita === false ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(false));
                break;
            default:
                console.error('[Errore Switch] ReducerSetFiltroSchedeContatto');
                break;
        }
        dispatch(new SetFiltroSelezionatoSchedaContatto(action.filtro));
    }

    @Action(SetFiltroKeySchedeContatto)
    setFiltroKeySchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroKeySchedeContatto) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                testoLibero: action.key
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SetFiltroGestitaSchedeContatto)
    setFiltroGestitaSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroGestitaSchedeContatto) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                gestita: action.gestita
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(ClearFiltriSchedeContatto)
    clearFiltriSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                gestita: null
            }
        });
        dispatch([ new GetListaSchedeContatto(), new ResetFiltriSelezionatiSchedeContatto() ]);
    }

    // SET FILTRO SELEZIONATO (SELEZIONATO, NON-SELEZIONATO)
    @Action(SetFiltroSelezionatoSchedaContatto)
    setFiltroSelezionato({ getState, patchState }: StateContext<SchedeContattoStateModel>, action: SetFiltroSelezionatoSchedaContatto) {
        const state = getState();

        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);
        const filtro = makeCopy(action.filtro);

        patchState({
            ...state,
            filtriSchedeContatto: _setFiltroSelezionato(filtriSchedeContatto, filtro)
        });
    }

    // RESET FILTRI SELEZIONATI
    @Action(ResetFiltriSelezionatiSchedeContatto)
    resetFiltriSelezionati({ getState, patchState }: StateContext<SchedeContattoStateModel>) {
        const state = getState();

        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);

        patchState({
            ...state,
            filtriSchedeContatto: _resetFiltriSelezionati(filtriSchedeContatto)
        });
    }

    @Action(SetRangeVisualizzazioneSchedeContatto)
    setRangeVisualizzazioneSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetRangeVisualizzazioneSchedeContatto) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                ...state.filtriSelezionati,
                rangeVisualizzazione: action.range
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SaveMergeSchedeContatto)
    saveMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: SaveMergeSchedeContatto) {
        console.log('Id Schede contatto selezionate', action.schedeSelezionateId);
        const state = getState();
        const schedeSelezionate = state.schedeContatto.filter((value) => {
            if (action.schedeSelezionateId.includes(value.codiceScheda)) {
                return value;
            }
        }).sort((a, b) =>
            (a.priorita < b.priorita) ? 1 :
                (a.priorita === b.priorita) ? ((new Date(a.dataInserimento).getTime() > new Date(b.dataInserimento).getTime()) ? 1 : -1) : -1);
        const mergeSchedeContatto: SchedaContatto = {
            ...schedeSelezionate[0],
            collegate: [ ...schedeSelezionate.slice(1).map(value => {
                return {
                    ...value,
                    collegata: true
                };
            }) ]
        };
        this.schedeContattoService.mergeSchedeContatto(mergeSchedeContatto).subscribe(() => {
            console.log('Unione schede completata', mergeSchedeContatto);
            dispatch([
                new ClearMergeSchedeContatto(),
                new ShowToastr(ToastrType.Success, 'Unione schede contatto', 'Unione completata con successo')
            ]);
        }, () => {
            console.log('Unione schede fallita', mergeSchedeContatto);
            dispatch(new ShowToastr(ToastrType.Error, 'Unione schede contatto', 'Impossibile unire le schede contatto'));
        });
    }

    @Action(UndoMergeSchedeContatto)
    undoMergeSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: UndoMergeSchedeContatto) {
        console.log('Id Scheda Contato Undo Merge', action.codiceScheda);
        const undoMergeSchedaContatto = getState().schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0];
        this.schedeContattoService.undoMergeSchedeContatto(undoMergeSchedaContatto).subscribe(() => {
            console.log('Undo Merge Schede completata', undoMergeSchedaContatto);
            dispatch([
                new ClearMergeSchedeContatto(),
                new ShowToastr(ToastrType.Success, 'Undo schede contatto', 'Undo Merge completata con successo')
            ]);
        }, () => {
            console.log('Unione Schede fallita', undoMergeSchedaContatto);
            dispatch(new ShowToastr(ToastrType.Error, 'Undo schede contatto', 'Impossibile annullare il raggruppamento delle schede contatto'));
        });
    }

    @Action(OpenDetailSC)
    openDetailSC({ getState, dispatch }: StateContext<SchedeContattoStateModel>, action: OpenDetailSC) {
        const state = getState();
        const schedaContattoDetail = state.schedeContatto.filter(value => value.codiceScheda === action.codiceScheda)[0];
        this.ngZone.run(() => {
            const modal = this.modal.open(DettaglioSchedaModalComponent,
                { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true }
                );
            modal.componentInstance.schedaContatto = schedaContattoDetail;
            modal.result.then(
                () => {},
                () => dispatch(new ClearMarkerSCSelezionato())
            );
        });
    }
}
