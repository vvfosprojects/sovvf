import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ruolo, Utente } from 'src/app/shared/model/utente.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import {
    ClearRicercaUtenti,
    ReducerSelezioneFiltroSede,
    ResetSediFiltroSelezionate,
    SetRicercaUtenti
} from './store/actions/ricerca-utenti/ricerca-utenti.actons';
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
import { GestioneUtenteModalComponent } from './gestione-utente-modal/gestione-utente-modal.component';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { wipeStringUppercase } from '../../shared/helper/function-generiche';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { RuoliUtenteLoggatoState } from '../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { AuthState } from '../auth/store/auth.state';
import { ConfirmModalComponent } from '../../shared/modal/confirm-modal/confirm-modal.component';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit, OnDestroy {

    @Select(AuthState.currentUser) utente$: Observable<Utente>;
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
    @Select(GestioneUtentiState.loadingGestioneUtenti) loading$: Observable<boolean>;
    @Select(RuoliUtenteLoggatoState.ruoliPrincipali) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(RuoliUtenteLoggatoState.ruoli) ruoliUtenteLoggatoConDistaccamenti$: Observable<Ruolo[]>;
    @Select(RicercaUtentiState.sediFiltro) sediFiltro$: Observable<Ruolo[]>;
    @Select(RicercaUtentiState.sediFiltroSelezionate) sediFiltroSelezionate$: Observable<string[]>;

    subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getUtente();
        this.getRicerca();
        this.getPageSize();
        this.getUtentiGestione(true);
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.GestioneUtenti),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaUtenti(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    onRicercaUtenti(ricerca: any): void {
        this.store.dispatch(new SetRicercaUtenti(ricerca));
    }

    onFiltroSediChange(filtroSede: string): void {
        this.store.dispatch(new ReducerSelezioneFiltroSede(filtroSede));
    }

    onFiltriReset(): void {
        this.store.dispatch(new ResetSediFiltroSelezionate());
    }

    onAddUtente(): void {
        let aggiungiUtenteModal;
        aggiungiUtenteModal = this.modalService.open(GestioneUtenteModalComponent, {
            windowClass: 'modal-holder',
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

    onAddRuoloUtente(event: { codFiscale: string, fullName: string, ruoliAttuali: Ruolo[] }): void {
        let aggiungiRuoloUtenteModal;
        aggiungiRuoloUtenteModal = this.modalService.open(GestioneUtenteModalComponent, {
            windowClass: 'modal-holder',
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

    onRemoveRuoloUtente(payload: { codFiscale: string, ruolo: Ruolo, nominativoUtente: string }): void {
        let modalConfermaAnnulla;
        modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Elimina ruolo a ' + payload.nominativoUtente;
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere il ruolo "' + wipeStringUppercase(payload.ruolo.descrizione) + '" su "' + payload.ruolo.descSede + '"?';

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

    onRemoveUtente(payload: { codFiscale: string, nominativoUtente: string }): void {
        let modalConfermaAnnulla;
        modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Elimina ' + payload.nominativoUtente;
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Sei sicuro di voler rimuovere l\'utente?';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
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

    onPageChange(page: number): void {
        this.store.dispatch(new GetUtentiGestione(page));
    }

    onPageSizeChange(page: number): void {
        this.store.dispatch(new SetPageSize(page));
    }

    getUtentiGestione(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetUtentiGestione(page));
    }

    getUtente(): void {
        this.subscriptions.add(
            this.utente$.subscribe((utente: Utente) => {
                this.utente = utente;
            })
        );
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetUtentiGestione());
                }
            })
        );
    }

    getPageSize(): void {
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
}
