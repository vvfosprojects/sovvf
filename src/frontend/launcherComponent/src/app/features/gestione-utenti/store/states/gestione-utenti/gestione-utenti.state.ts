import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GestioneUtente } from '../../../../../shared/interface/gestione-utente.interface';
import {
    AddUtente,
    UpdateUtenteGestione,
    GetUtentiGestione,
    RemoveUtente,
    SetUtentiGestione, OpenModalAddUtente, OpenModalRemoveUtente
} from '../../actions/gestione-utenti/gestione-utenti.actions';
import { GestioneUtentiService } from '../../../../../core/service/gestione-utenti-service/gestione-utenti.service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { AggiungiUtenteModalComponent } from '../../../aggiungi-utente-modal/aggiungi-utente-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone } from '@angular/core';
import { ConfirmModalComponent } from '../../../../../shared';
import { RicercaUtentiState } from '../ricerca-utenti/ricerca-utenti.state';
import { PatchPagination } from '../../../../../shared/store/actions/pagination/pagination.actions';
import { ResponseInterface } from '../../../../../shared/interface/response.interface';

export interface GestioneUtentiStateModel {
    listaUtenti: GestioneUtente[];
    nuovoUtenteForm: {
        model?: {
            utenti: string;
            ruoli: string[];
            sedi: string[]
        };
        dirty: boolean;
        status: string;
        errors: any;
    };
}

export const GestioneUtentiStateModelDefaults: GestioneUtentiStateModel = {
    listaUtenti: [],
    nuovoUtenteForm: {
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

    @Action(GetUtentiGestione)
    getGestioneUtenti({ dispatch }: StateContext<GestioneUtentiStateModel>) {
        const filters = {
            search: this.store.selectSnapshot(RicercaUtentiState.ricerca)
        };
        this._gestioneUtenti.getUtenti(filters).subscribe((response: ResponseInterface) => {
            dispatch(new SetUtentiGestione(response.dataArray));
            dispatch(new PatchPagination(response.pagination));
        });
    }

    @Action(SetUtentiGestione)
    setUtentiGestione({ patchState }: StateContext<GestioneUtentiStateModel>, action: SetUtentiGestione) {
        patchState({
            listaUtenti: action.utenti
        });
    }

    @Action(UpdateUtenteGestione)
    updateUtenteGestione({ dispatch }: StateContext<GestioneUtentiStateModel>, action: UpdateUtenteGestione) {
        this._gestioneUtenti.updateUtente(action.utente).subscribe((utente: GestioneUtente) => {
            if (utente) {
                patch(
                    updateItem(+utente.id, utente)
                );
                dispatch(new ShowToastr(ToastrType.Info, 'Ruolo Utente Aggiornato', 'Ruolo utente aggiornato con successo.', 2));
            }
        });
    }

    @Action(OpenModalAddUtente)
    openModalAddUtente({ dispatch }: StateContext<GestioneUtentiStateModel>) {
        this.ngZone.run(() => {
            const aggiungiUtenteModal = this.modalService.open(AggiungiUtenteModalComponent, { backdropClass: 'light-blue-backdrop', centered: true, size: 'lg' });
            aggiungiUtenteModal.componentInstance.ruoli = [];
            aggiungiUtenteModal.result.then(
                (risultatoModal) => {
                    if (risultatoModal[0] === 'ok') {
                        dispatch(new AddUtente(risultatoModal[1]));
                    }
                    // console.log('Modal chiusa con val ->', val);
                },
                (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
            );
        });
    }

    @Action(AddUtente)
    addUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: AddUtente) {
        this._gestioneUtenti.addUtente(action.utente).subscribe((utente: GestioneUtente) => {
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
            modalConfermaAnnulla.componentInstance.titolo = 'Elimina permesso utente';
            modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler eliminare questo utente dai permessi?';
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
    removeUtente({ dispatch }: StateContext<GestioneUtentiStateModel>, action: RemoveUtente) {
        this._gestioneUtenti.removeUtente(action.id).subscribe(() => {
            patch(
                insertItem(u => u.id === action.id)
            );
            dispatch(new ShowToastr(ToastrType.Info, 'Utente Rimosso', 'Utente rimosso con successo.', 3));
        });
    }
}
