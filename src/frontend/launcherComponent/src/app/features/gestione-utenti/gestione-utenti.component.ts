import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ruolo, Utente } from 'src/app/shared/model/utente.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import {
    ClearRicercaUtenti,
    ReducerSelezioneFiltroSede,
    SetRicercaUtenti,
    SetSediFiltro
} from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import { UtenteState } from '../navbar/store/states/operatore/utente.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    AddRuoloUtenteGestione,
    AddUtenteGestione,
    ClearDataModalAddUtenteModal,
    GetUtentiGestione,
    RemoveRuoloUtente,
    RemoveUtente
} from './store/actions/gestione-utenti/gestione-utenti.actions';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { GestioneUtenteModalComponent } from './gestione-utente-modal/gestione-utente-modal.component';
import { ConfirmModalComponent } from 'src/app/shared';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { wipeStringUppercase } from '../../shared/helper/function';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { RuoliUtenteLoggatoState } from '../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: [ './gestione-utenti.component.css' ]
})
export class GestioneUtentiComponent implements OnInit, OnDestroy {

    @Select(UtenteState.utente) utente$: Observable<Utente>;
    utente: Utente;
    @Select(GestioneUtentiState.listaUtenti) listaUtenti$: Observable<Utente[]>;
    @Select(GestioneUtentiState.utenteDetail) utenteGestioneDetail$: Observable<Utente>;
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(RuoliUtenteLoggatoState.ruoliPrincipali) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(RicercaUtentiState.sediFiltro) sediFiltro$: Observable<Ruolo[]>;
    @Select(RicercaUtentiState.sediFiltroSelezionate) sediFiltroSelezionate$: Observable<string[]>;

    subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        this.getUtente();
        this.getRicerca();
        this.getPageSize();
        this.getPageSize();
        this.getSediFiltro();
    }

    ngOnInit() {
        this.store.dispatch(new SetSediNavbarVisible(false));
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaUtenti(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(ricerca));
    }

    onFiltroSediChange(filtroSede: string) {
        this.store.dispatch(new ReducerSelezioneFiltroSede(filtroSede));
    }

    onAddUtente() {
        const aggiungiUtenteModal = this.modalService.open(GestioneUtenteModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
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

    onAddRuoloUtente(event: { codFiscale: string, fullName: string, ruoliAttuali: Ruolo[] }) {
        const aggiungiRuoloUtenteModal = this.modalService.open(GestioneUtenteModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        const codFiscaleUtenteVVF = event.codFiscale;
        const nominativoUtenteVVF = event.fullName;
        const ruoliAttuali = event.ruoliAttuali;
        aggiungiRuoloUtenteModal.componentInstance.codFiscaleUtenteVVF = codFiscaleUtenteVVF;
        aggiungiRuoloUtenteModal.componentInstance.nominativoUtenteVVF = nominativoUtenteVVF;
        aggiungiRuoloUtenteModal.componentInstance.ruoliAttuali = ruoliAttuali;
        aggiungiRuoloUtenteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new AddRuoloUtenteGestione());
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

    onRemoveRuoloUtente(payload: { codFiscale: string, ruolo: Ruolo, nominativoUtente: string }) {
        const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Elimina ruolo a ' + payload.nominativoUtente;
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere il ruolo "' + wipeStringUppercase(payload.ruolo.descrizione) + '" su "' + payload.ruolo.descSede + '"?';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
            { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
        ];
        modalConfermaAnnulla.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new RemoveRuoloUtente(payload.codFiscale, payload.ruolo));
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

    onRemoveUtente(payload: { codFiscale: string, nominativoUtente: string }) {
        const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
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
                        this.store.dispatch(new RemoveUtente(payload.codFiscale));
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

    onPageSizeChange(page: number) {
        this.store.dispatch(new SetPageSize(page));
    }

    getUtentiGestione() {
        this.store.dispatch(new GetUtentiGestione());
    }

    getUtente() {
        this.subscriptions.add(
            this.utente$.subscribe((utente: Utente) => {
                this.utente = utente;
            })
        );
    }

    getRicerca() {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetUtentiGestione());
                }
            })
        );
    }

    getPageSize() {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetUtentiGestione());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }

    getSediFiltro() {
        this.subscriptions.add(
            this.ruoliUtenteLoggato$.subscribe((ruoli: Ruolo[]) => {
                if (ruoli && ruoli.length > 0) {
                    const sediFiltro = ruoli.filter((r: Ruolo) => r.descrizione === 'Amministratore');
                    this.store.dispatch(new SetSediFiltro(sediFiltro));
                    this.getUtentiGestione();
                }
            })
        );
    }
}
