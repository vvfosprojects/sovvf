import { Component, OnInit } from '@angular/core';
import { Ruolo, Utente } from 'src/app/shared/model/utente.model';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetRicercaUtenti } from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import { UtenteState } from '../navbar/store/states/operatore/utente.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetUtentiGestione, AddRuoloUtenteGestione, ClearDataModalAddUtenteModal, RemoveRuoloUtente, AddUtenteGestione, RemoveUtente } from './store/actions/gestione-utenti/gestione-utenti.actions';
import { GetRuoli } from './store/actions/ruoli/ruoli.actions';
import { RuoliState } from './store/states/ruoli/ruoli.state';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { GestioneUtenteModalComponent } from './gestione-utente-modal/gestione-utente-modal.component';
import { ConfirmModalComponent } from 'src/app/shared';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit {

    @Select(UtenteState.utente) user$: Observable<Utente>;
    @Select(GestioneUtentiState.listaUtenti) listaUtenti$: Observable<Utente[]>;
    @Select(GestioneUtentiState.utenteDetail) utenteGestioneDetail$: Observable<Utente>;
    @Select(RuoliState.ruoli) ruoli$: Observable<Array<any>>;
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<any>;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    constructor(public modalService: NgbModal,
        private store: Store) {
        this.getUtentiGestione();
        this.getRuoli();
        this.getRicerca();
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(ricerca));
    }

    ngOnInit(): void {
    }

    onAddUtente() {
        const aggiungiUtenteModal = this.modalService.open(GestioneUtenteModalComponent, { backdropClass: 'light-blue-backdrop', centered: true, size: 'lg' });
        aggiungiUtenteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new AddUtenteGestione());
                } else if (!result.success) {
                    this.store.dispatch(new ClearDataModalAddUtenteModal());
                    console.log('Modal "addUtente" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearDataModalAddUtenteModal());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onAddRuoloUtente(event: { codFiscale: string, fullName: string }) {
        const aggiungiRuoloUtenteModal = this.modalService.open(GestioneUtenteModalComponent, { backdropClass: 'light-blue-backdrop', centered: true, size: 'lg' });
        const codFiscaleUtenteVVF = event.codFiscale;
        const nominativoUtenteVVF = event.fullName;
        aggiungiRuoloUtenteModal.componentInstance.codFiscaleUtenteVVF = codFiscaleUtenteVVF;
        aggiungiRuoloUtenteModal.componentInstance.nominativoUtenteVVF = nominativoUtenteVVF;
        aggiungiRuoloUtenteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new AddRuoloUtenteGestione(codFiscaleUtenteVVF));
                } else if (!result.success) {
                    this.store.dispatch(new ClearDataModalAddUtenteModal());
                    console.log('Modal "addRuoloUtente" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearDataModalAddUtenteModal());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onRemoveRuoloUtente(payload: { id: string, ruolo: Ruolo, nominativoUtente: string }) {
        const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Elimina ruolo a ' + payload.nominativoUtente;
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere il ruolo "' + payload.ruolo.descrizione + '" su "' + payload.ruolo.descSede + '"?';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
            { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
        ];
        modalConfermaAnnulla.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new RemoveRuoloUtente(payload.id, payload.ruolo));
                        break;
                    case 'ko':
                        // console.log('Azione annullata');
                        break;
                }
                // console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onRemoveUtente(payload: { id: string, nominativoUtente: string }) {
        const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Elimina ' + payload.nominativoUtente;
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere l\'utente?';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
            { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
        ];
        modalConfermaAnnulla.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new RemoveUtente(payload.id));
                        break;
                    case 'ko':
                        // console.log('Azione annullata');
                        break;
                }
                // console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onPageChange(page: number) {
        this.store.dispatch(new GetUtentiGestione(page));
    }

    getUtentiGestione() {
        this.store.dispatch(new GetUtentiGestione());
    }

    getRuoli() {
        this.store.dispatch(new GetRuoli());
    }

    getRicerca() {
        this.ricerca$.subscribe(() => {
            this.store.dispatch(new GetUtentiGestione());
        });
    }
}
