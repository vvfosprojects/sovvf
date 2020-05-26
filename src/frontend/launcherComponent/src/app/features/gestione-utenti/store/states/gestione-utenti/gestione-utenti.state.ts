import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    AddRuoloUtenteGestione,
    ClearUtentiVVF,
    GetUtentiGestione,
    GetUtentiVVF,
    RemoveRuoloUtente,
    RemoveUtente,
    SetUtentiGestione,
    SetUtentiVVF,
    ClearDataModalAddUtenteModal,
    AddUtenteGestione
} from '../../actions/gestione-utenti/gestione-utenti.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RicercaUtentiState } from '../ricerca-utenti/ricerca-utenti.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { TreeviewSelezione } from '../../../../../shared/model/treeview-selezione.model';
import { Utente } from '../../../../../shared/model/utente.model';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';
import { UtenteVvfInterface } from '../../../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../../../shared/interface/add-ruolo-utente.interface';
import { UpdateFormValue, SetFormEnabled } from '@ngxs/form-plugin';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { StartLoading, StopLoading } from '../../../../../shared/store/actions/loading/loading.actions';
import { Navigate } from '@ngxs/router-plugin';
import { ActivatedRoute } from '@angular/router';
import { _isAdministrator } from '../../../../../shared/helper/function';
import { UtenteState } from '../../../../navbar/store/states/operatore/utente.state';

export interface GestioneUtentiStateModel {
    listaUtentiVVF: UtenteVvfInterface[];
    listaUtenti: Utente[];
    utenteDetail: Utente;
    addUtenteRuoloForm: {
        model?: {
            utente: string;
            ruolo: string;
            sedi: TreeviewSelezione[];
            ricorsivo: boolean;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const GestioneUtentiStateModelDefaults: GestioneUtentiStateModel = {
    listaUtentiVVF: [],
    listaUtenti: [],
    utenteDetail: null,
    addUtenteRuoloForm: {
        model: undefined,
        dirty: false,
        status: '',
        errors: {}
    }
};

@State<GestioneUtentiStateModel>({
    name: 'gestioneUtenti',
    defaults: GestioneUtentiStateModelDefaults
})
export class GestioneUtentiState {

    constructor(private _gestioneUtenti: GestioneUtentiService,
                private modalService: NgbModal,
                private router: ActivatedRoute,
                private store: Store) {
    }

    @Selector()
    static listaUtenti(state: GestioneUtentiStateModel) {
        return state.listaUtenti;
    }

    @Selector()
    static listaUtentiVVF(state: GestioneUtentiStateModel) {
        return state.listaUtentiVVF;
    }

    @Selector()
    static utenteDetail(state: GestioneUtentiStateModel) {
        return state.utenteDetail;
    }

    @Selector()
    static sedeSelezionata(state: GestioneUtentiStateModel) {
        return state.addUtenteRuoloForm.model.sedi;
    }

    @Selector()
    static formValid(state: GestioneUtentiStateModel) {
        return state.addUtenteRuoloForm.status !== 'INVALID';
    }

    @Action(GetUtentiVVF)
    getUtentiVVF({ dispatch }: StateContext<GestioneUtentiStateModel>, action: GetUtentiVVF) {
        this._gestioneUtenti.getUtentiVVF(action.text).subscribe((data: UtenteVvfInterface[]) => {
            dispatch(new SetUtentiVVF(data));
            dispatch(new StopLoading());
        });
    }

    @Action(SetUtentiVVF)
    setUtentiVVF({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiVVF) {
        patchState({
            listaUtentiVVF: action.utenti
        });
    }

    @Action(ClearUtentiVVF)
    clearUtentiVVF({ patchState }: StateContext<GestioneUtentiStateModel>) {
        patchState({
            listaUtentiVVF: []
        });
    }

    @Action(GetUtentiGestione)
    getGestioneUtenti({ dispatch }: StateContext<GestioneUtentiStateModel>, action: GetUtentiGestione) {
        const route = this.router.children[0].snapshot.url[0].path;
        if (route === 'gestione-utenti') {
            dispatch(new StartLoading());
            const filters = {
                search: this.store.selectSnapshot(RicercaUtentiState.ricerca),
                codiciSede: [] // Todo prende i codiciSede selezionati
            };
            const pagination = {
                page: action.page ? action.page : 1,
                pageSize: this.store.selectSnapshot(PaginationState.pageSize)
            };
            this._gestioneUtenti.getListaUtentiGestione(filters, pagination).subscribe((response: ResponseInterface) => {
                    dispatch(new SetUtentiGestione(response.dataArray));
                    dispatch(new PatchPagination(response.pagination));
                    dispatch(new StopLoading());
                },
                error => {
                    const utente = this.store.selectSnapshot(UtenteState.utente);
                    if (!_isAdministrator(utente, { sede: utente.sede })) {
                        this.store.dispatch(new Navigate(['/home']));
                    }
                });
        }
    }

    @Action(SetUtentiGestione)
    setUtentiGestione({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiGestione) {
        patchState({
            listaUtenti: action.utenti
        });
    }

    @Action(AddUtenteGestione)
    addUtenteGestione({ getState, dispatch }: StateContext<GestioneUtentiStateModel>) {
        const form = getState().addUtenteRuoloForm.model;

        const obj: AddRuoloUtenteInterface = {
            codFiscale: form.utente,
            ruoli: []
        };
        form.sedi.forEach((value: TreeviewSelezione) => {
            obj.ruoli.push({
                descrizione: form.ruolo,
                codSede: value.idSede,
                ricorsivo: form.ricorsivo
            });
        });

        this._gestioneUtenti.addUtente(obj).subscribe((utente: Utente) => {
                if (utente) {
                    patch(
                        insertItem(utente)
                    );
                    dispatch(new ShowToastr(ToastrType.Info, 'Utente Aggiunto', 'Utente aggiunto con successo.', 3));
                }
            }
        );

        // Clear data
        dispatch(new ClearDataModalAddUtenteModal());
    }

    @Action(AddRuoloUtenteGestione)
    addRuoloUtenteGestione({ getState, dispatch }: StateContext<GestioneUtentiStateModel>) {
        const form = getState().addUtenteRuoloForm.model;
        const obj: AddRuoloUtenteInterface = {
            codFiscale: form.utente,
            ruoli: []
        };
        form.sedi.forEach((value: TreeviewSelezione) => {
            obj.ruoli.push({
                descrizione: form.ruolo,
                codSede: value.idSede,
                ricorsivo: form.ricorsivo
            });
        });

        this._gestioneUtenti.addRuoloUtente(obj).subscribe(() => {
            dispatch(new ShowToastr(ToastrType.Info, 'Utente Aggiunto', 'Utente aggiunto con successo.', 3));
        });

        // Clear data
        dispatch(new ClearDataModalAddUtenteModal());
    }

    @Action(RemoveUtente)
    removeUtente({ setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveUtente) {
        this._gestioneUtenti.removeUtente(action.id).subscribe(() => {
            setState(
                patch({
                    listaUtenti: removeItem<Utente>(u => u.id === action.id)
                })
            );
            dispatch(new ShowToastr(ToastrType.Info, 'Utente Rimosso', 'Utente rimosso con successo.', 3));
        });
    }

    @Action(RemoveRuoloUtente)
    removeRuoloUtente({ setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveRuoloUtente) {
        this._gestioneUtenti.removeRuoloUtente(action.codFiscale, action.ruolo).subscribe(() => {
            dispatch(new ShowToastr(ToastrType.Info, 'Ruolo Utente Rimosso', 'Ruolo Utente rimosso con successo.', 3));
        });
    }

    @Action(ClearDataModalAddUtenteModal)
    clearDataModalAddUtenteModal({ dispatch }: StateContext<GestioneUtentiStateModel>) {
        dispatch(new UpdateFormValue({
            value: null,
            path: 'gestioneUtenti.addUtenteRuoloForm'
        }));
        dispatch(new SetFormEnabled('gestioneUtenti.addUtenteRuoloForm'));
        dispatch(new ClearUtentiVVF());
    }
}
