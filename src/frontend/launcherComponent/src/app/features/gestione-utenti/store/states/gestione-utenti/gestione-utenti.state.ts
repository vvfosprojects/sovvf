import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    AddRuoloUtenteGestione,
    ClearUtenteDetail,
    ClearUtentiVVF,
    GetUtenteDetail,
    GetUtentiGestione,
    GetUtentiVVF,
    OpenModalRemoveRuoloUtente,
    OpenModalRemoveUtente,
    RemoveRuoloUtente,
    RemoveUtente,
    SetUtenteDetail,
    SetUtentiGestione,
    SetUtentiVVF,
    UpdateUtenteGestione
} from '../../actions/gestione-utenti/gestione-utenti.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone } from '@angular/core';
import { ConfirmModalComponent } from '../../../../../shared';
import { RicercaUtentiState } from '../ricerca-utenti/ricerca-utenti.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';
import { TreeviewSelezione } from '../../../../../shared/model/treeview-selezione.model';
import { Utente } from '../../../../../shared/model/utente.model';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';
import { UtenteVvfInterface } from '../../../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteInterface } from '../../../../../shared/interface/add-ruolo-utente.interface';

export interface GestioneUtentiStateModel {
    listaUtentiVVF: UtenteVvfInterface[];
    listaUtenti: Utente[];
    utenteDetail: Utente;
    addUtenteRuoloForm: {
        model?: {
            utente: string;
            ruolo: string;
            sedi: TreeviewSelezione[]
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
                private store: Store,
                private ngZone: NgZone) {
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

    @Action(GetUtentiVVF)
    getUtentiVVF({ dispatch }: StateContext<GestioneUtentiStateModel>, action: GetUtentiVVF) {
        this._gestioneUtenti.getUtentiVVF(action.text).subscribe((data: UtenteVvfInterface[]) => {
            dispatch(new SetUtentiVVF(data));
        });
    }

    @Action(SetUtentiVVF)
    setUtentiVVF({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiVVF) {
        console.log('Utenti VVF', action.utenti);
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
    getGestioneUtenti({ dispatch }: StateContext<GestioneUtentiStateModel>) {
        const filters = {
            search: this.store.selectSnapshot(RicercaUtentiState.ricerca)
        };
        this._gestioneUtenti.getListaUtentiGestione(filters).subscribe((response: ResponseInterface) => {
            dispatch(new SetUtentiGestione(response.dataArray));
            dispatch(new PatchPagination(response.pagination));
        });
    }

    @Action(SetUtentiGestione)
    setUtentiGestione({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiGestione) {
        console.log('Utenti', action.utenti);
        patchState({
            listaUtenti: action.utenti
        });
    }

    @Action(GetUtenteDetail)
    getUtenteDetail({ dispatch }: StateContext<GestioneUtentiStateModel>, action: GetUtenteDetail) {
        this._gestioneUtenti.getUtente(action.id).subscribe((utente: Utente) => {
            if (utente) {
                dispatch(new SetUtenteDetail(utente));
            }
        });
    }

    @Action(SetUtenteDetail)
    setUtenteDetail({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtenteDetail) {
        patchState({
            utenteDetail: action.utente
        });
    }

    @Action(ClearUtenteDetail)
    clearUtenteDetail({ patchState }: StateContext<GestioneUtentiStateModel>) {
        patchState({
            utenteDetail: null
        });
    }

    @Action(UpdateUtenteGestione)
    updateUtenteGestione({ dispatch }: StateContext<GestioneUtentiStateModel>, action: UpdateUtenteGestione) {
        this._gestioneUtenti.updateUtente(action.utente).subscribe((utente: Utente) => {
            if (utente) {
                patch(
                    updateItem(+utente.id, utente)
                );
                dispatch(new ShowToastr(ToastrType.Info, 'Ruolo Utente Aggiornato', 'Ruolo utente aggiornato con successo.', 2));
            }
        });
    }

    @Action(AddRuoloUtenteGestione)
    addUtenteGestione({ getState, dispatch }: StateContext<GestioneUtentiStateModel>) {
        const form = getState().addUtenteRuoloForm.model;
        const obj: AddRuoloUtenteInterface = {
            codFiscale: form.utente,
            ruoli: []
        };
        form.sedi.forEach((value: TreeviewSelezione) => {
            obj.ruoli.push({
                descrizione: form.ruolo.replace(/ /g, ''),
                codSede: value.idSede
            });
        });
        this._gestioneUtenti.addUtente(obj).subscribe((utente: Utente) => {
            if (utente) {
                patch(
                    insertItem(utente)
                );
                dispatch(new ShowToastr(ToastrType.Info, 'Utente Aggiunto', 'Utente aggiunto con successo.', 3));
            }
        });
    }

    @Action(OpenModalRemoveUtente)
    openModalRemoveUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: OpenModalRemoveUtente) {
        this.ngZone.run(() => {
            const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
            modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
            modalConfermaAnnulla.componentInstance.titolo = 'Elimina ' + action.nominativoUtente;
            modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere l\'utente?';
            modalConfermaAnnulla.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
                { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
            ];
            modalConfermaAnnulla.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
                            dispatch(new RemoveUtente(action.id));
                            break;
                        case 'ko':
                            // console.log('Azione annullata');
                            break;
                    }
                    // console.log('Modal chiusa con val ->', val);
                },
                (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
            );
        });
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

    @Action(OpenModalRemoveRuoloUtente)
    openModalRemoveRuoloUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: OpenModalRemoveRuoloUtente) {
        this.ngZone.run(() => {
            const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
            modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
            modalConfermaAnnulla.componentInstance.titolo = 'Elimina ruolo a ' + action.nominativoUtente;
            modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere il ruolo "' + action.ruolo.descrizione + '" su "' + action.ruolo.descSede + '"?';
            modalConfermaAnnulla.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
                { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
            ];
            modalConfermaAnnulla.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
                            dispatch(new RemoveRuoloUtente(action.id, action.ruolo));
                            break;
                        case 'ko':
                            // console.log('Azione annullata');
                            break;
                    }
                    // console.log('Modal chiusa con val ->', val);
                },
                (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
            );
        });
    }

    @Action(RemoveRuoloUtente)
    removeRuoloUtente({ setState, dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveRuoloUtente) {
        this._gestioneUtenti.removeRuoloUtente(action.id, action.ruolo).subscribe((utente: Utente) => {
            console.log('utente', utente);
            setState(
                patch({
                    listaUtenti: updateItem<Utente>(u => u.id === action.id, utente)
                })
            );
            dispatch(new ShowToastr(ToastrType.Info, 'Ruolo Utente Rimosso', 'Ruolo Utente rimosso con successo.', 3));
        });
    }
}
