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
    AddUtenteGestione,
    UpdateUtenteGestioneInLista,
    SuccessAddUtenteGestione,
    SuccessRemoveUtente,
    StartLoadingGestioneUtenti,
    StopLoadingGestioneUtenti
} from '../../actions/gestione-utenti/gestione-utenti.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RicercaUtentiState } from '../ricerca-utenti/ricerca-utenti.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response/response.interface';
import { Ruolo, Utente } from '../../../../../shared/model/utente.model';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';
import { UtenteVvfInterface } from '../../../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../../../shared/interface/add-ruolo-utente.interface';
import { UpdateFormValue, SetFormEnabled } from '@ngxs/form-plugin';
import { PaginationState } from '../../../../../shared/store/states/pagination/pagination.state';
import { Navigate } from '@ngxs/router-plugin';
import { ActivatedRoute } from '@angular/router';
import { _isAdministrator } from '../../../../../shared/helper/function-generiche';
import { AuthState } from '../../../../auth/store/auth.state';
import { SetSediFiltro } from '../../actions/ricerca-utenti/ricerca-utenti.actons';
import { Injectable } from '@angular/core';

export interface GestioneUtentiStateModel {
    listaUtentiVVF: UtenteVvfInterface[];
    listaUtenti: Utente[];
    utenteDetail: Utente;
    addUtenteRuoloForm: {
        model?: {
            utente: string;
            ruolo: string;
            sedi: string[];
            ricorsivo: boolean;
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
    loadingGestioneUtenti: boolean;
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
    },
    loadingGestioneUtenti: false
};

@Injectable()
@State<GestioneUtentiStateModel>({
    name: 'gestioneUtenti',
    defaults: GestioneUtentiStateModelDefaults
})
export class GestioneUtentiState {

    constructor(private gestioneUtenti: GestioneUtentiService,
                private modalService: NgbModal,
                private router: ActivatedRoute,
                private store: Store) {
    }

    @Selector()
    static listaUtenti(state: GestioneUtentiStateModel): Utente[] {
        return state.listaUtenti;
    }

    @Selector()
    static listaUtentiVVF(state: GestioneUtentiStateModel): UtenteVvfInterface[] {
        return state.listaUtentiVVF;
    }

    @Selector()
    static utenteDetail(state: GestioneUtentiStateModel): Utente {
        return state.utenteDetail;
    }

    @Selector()
    static formValid(state: GestioneUtentiStateModel): boolean {
        return state.addUtenteRuoloForm.status !== 'INVALID';
    }

    @Selector()
    static loadingGestioneUtenti(state: GestioneUtentiStateModel): boolean {
        return state.loadingGestioneUtenti;
    }

    @Action(GetUtentiVVF)
    getUtentiVVF({ dispatch }: StateContext<GestioneUtentiStateModel>, action: GetUtentiVVF): void {
        dispatch(new StartLoadingGestioneUtenti());
        const nome = action.nome;
        const cognome = action.cognome;
        const codiceFiscale = action.codiceFiscale;
        this.gestioneUtenti.getUtentiVVF(nome, cognome, codiceFiscale).subscribe((data: UtenteVvfInterface[]) => {
            dispatch([
                new SetUtentiVVF(data),
                new StopLoadingGestioneUtenti()
            ]);
        }, () => dispatch(new StopLoadingGestioneUtenti()));
    }

    @Action(SetUtentiVVF)
    setUtentiVVF({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiVVF): void {
        patchState({
            listaUtentiVVF: action.utenti
        });
    }

    @Action(ClearUtentiVVF)
    clearUtentiVVF({ patchState }: StateContext<GestioneUtentiStateModel>): void {
        patchState({
            listaUtentiVVF: []
        });
    }

    @Action(GetUtentiGestione)
    getUtentiGestione({ dispatch }: StateContext<GestioneUtentiStateModel>, action: GetUtentiGestione): void {
        const route = this.router.children[0].snapshot.url[0].path;
        if (route === 'gestione-utenti') {
            dispatch(new StartLoadingGestioneUtenti());
            const ricerca = this.store.selectSnapshot(RicercaUtentiState.ricerca);
            const filtroSede = this.store.selectSnapshot(RicercaUtentiState.sediFiltroSelezionate);
            const filters = {
                search: ricerca,
                codSede: filtroSede
            };
            const pagination = {
                page: action.page ? action.page : 1,
                pageSize: this.store.selectSnapshot(PaginationState.pageSize)
            };
            this.gestioneUtenti.getListaUtentiGestione(filters, pagination).subscribe((response: ResponseInterface) => {
                    let listaSediPresentiUnique = [];
                    if (response?.listaSediPresenti?.length) {
                        listaSediPresentiUnique = [
                            ...new Map(response.listaSediPresenti.map((ruolo: Ruolo) => [ruolo.codSede, ruolo])).values(),
                        ];
                    }
                    dispatch([
                        new SetUtentiGestione(response.dataArray),
                        new PatchPagination(response.pagination),
                        new SetSediFiltro(listaSediPresentiUnique),
                        new StopLoadingGestioneUtenti()
                    ]);
                },
                () => {
                    const utente = this.store.selectSnapshot(AuthState.currentUser);
                    if (!_isAdministrator(utente, { sede: utente.sede })) {
                        dispatch(new Navigate(['/home']));
                    }
                });
        }
    }

    @Action(SetUtentiGestione)
    setUtentiGestione({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiGestione): void {
        patchState({
            listaUtenti: action.utenti
        });
    }

    @Action(AddUtenteGestione)
    addUtenteGestione({ getState, dispatch }: StateContext<GestioneUtentiStateModel>): void {
        const form = getState().addUtenteRuoloForm.model;

        const obj: AddRuoloUtenteInterface = {
            codFiscale: form.utente,
            ruoli: []
        };
        form.sedi.forEach((codice: string) => {
            obj.ruoli.push({
                descrizione: form.ruolo,
                codSede: codice,
                ricorsivo: form.ricorsivo
            });
        });

        this.gestioneUtenti.addUtente(obj).subscribe((utente: Utente) => {
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

    @Action(SuccessAddUtenteGestione)
    successAddUtenteGestione({ dispatch }: StateContext<GestioneUtentiStateModel>): void {
        const pagina = this.store.selectSnapshot(PaginationState.page);
        if (pagina === 1) {
            dispatch(new GetUtentiGestione());
        }
    }

    @Action(AddRuoloUtenteGestione)
    addRuoloUtenteGestione({ getState, dispatch }: StateContext<GestioneUtentiStateModel>): void {
        const form = getState().addUtenteRuoloForm.model;
        const obj: AddRuoloUtenteInterface = {
            codFiscale: form.utente,
            ruoli: []
        };
        form.sedi.forEach((codice: string) => {
            obj.ruoli.push({
                descrizione: form.ruolo,
                codSede: codice,
                ricorsivo: form.ricorsivo
            });
        });

        this.gestioneUtenti.addRuoloUtente(obj).subscribe(() => {
            dispatch(new ShowToastr(ToastrType.Info, 'Utente Aggiunto', 'Utente aggiunto con successo.', 3));
        });

        // Clear data
        dispatch(new ClearDataModalAddUtenteModal());
    }

    @Action(UpdateUtenteGestioneInLista)
    updateUtenteGestioneInLista({ getState, setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: UpdateUtenteGestioneInLista): void {
        const listaUtentiGestione = getState().listaUtenti;
        const utentePresente = listaUtentiGestione.filter((u: Utente) => u.id === action.idUtente).length > 0;
        if (utentePresente) {
            this.gestioneUtenti.getUtente(action.idUtente).subscribe((utenteObj: { detUtente: Utente }) => {
                setState(
                    patch({
                        listaUtenti: updateItem<Utente>(u => u.id === action.idUtente, utenteObj.detUtente)
                    })
                );
            });
        }
    }

    @Action(RemoveUtente)
    removeUtente({ setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveUtente): void {
        this.gestioneUtenti.removeUtente(action.id).subscribe();
    }

    @Action(SuccessRemoveUtente)
    successRemoveUtente({ setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: SuccessRemoveUtente): void {
        setState(
            patch({
                listaUtenti: removeItem<Utente>(u => u.id === action.idUtente)
            })
        );
        dispatch(new ShowToastr(ToastrType.Info, 'Utente Rimosso', 'Utente rimosso con successo.', 3));
    }

    @Action(RemoveRuoloUtente)
    removeRuoloUtente({ setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveRuoloUtente): void {
        this.gestioneUtenti.removeRuoloUtente(action.codFiscale, action.ruolo).subscribe(() => {
            dispatch(new ShowToastr(ToastrType.Info, 'Ruolo Utente Rimosso', 'Ruolo Utente rimosso con successo.', 3));
        });
    }

    @Action(ClearDataModalAddUtenteModal)
    clearDataModalAddUtenteModal({ dispatch }: StateContext<GestioneUtentiStateModel>): void {
        dispatch([
            new UpdateFormValue({
                value: null,
                path: 'gestioneUtenti.addUtenteRuoloForm'
            }),
            new SetFormEnabled('gestioneUtenti.addUtenteRuoloForm'),
            new ClearUtentiVVF()
        ]);
    }

    @Action(StartLoadingGestioneUtenti)
    startLoadingGestioneUtenti({ patchState }: StateContext<GestioneUtentiStateModel>): void {
        patchState({
            loadingGestioneUtenti: true
        });
    }

    @Action(StopLoadingGestioneUtenti)
    stopLoadingGestioneUtenti({ patchState }: StateContext<GestioneUtentiStateModel>): void {
        patchState({
            loadingGestioneUtenti: false
        });
    }
}
