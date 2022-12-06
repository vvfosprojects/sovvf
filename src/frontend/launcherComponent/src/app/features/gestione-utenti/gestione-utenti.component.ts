import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ruolo, Utente } from 'src/app/shared/model/utente.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ClearRicercaUtenti, ReducerSelezioneFiltroSede, ResetSediFiltroSelezionate, SetRicercaUtenti } from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRuoloUtenteGestione, AddUtenteGestione, ClearDataModalAddUtenteModal, GetUtentiGestione, RemoveRuoloUtente, RemoveUtente } from './store/actions/gestione-utenti/gestione-utenti.actions';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { GestioneUtenteModalComponent } from './gestione-utente-modal/gestione-utente-modal.component';
import { wipeStringUppercase } from '../../shared/helper/function-generiche';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { RuoliUtenteLoggatoState } from '../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { AuthState } from '../auth/store/auth.state';
import { ConfirmModalComponent } from '../../shared/modal/confirm-modal/confirm-modal.component';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { GetDistaccamenti } from '../../shared/store/actions/distaccamenti/distaccamenti.actions';
import { TipoConcorrenzaEnum } from '../../shared/enum/tipo-concorrenza.enum';
import { AddConcorrenza, DeleteConcorrenza } from '../../shared/store/actions/concorrenza/concorrenza.actions';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    utente: Utente;
    @Select(GestioneUtentiState.listaUtenti) listaUtenti$: Observable<Utente[]>;
    listaUtenti: Utente[];
    @Select(GestioneUtentiState.utenteDetail) utenteGestioneDetail$: Observable<Utente>;
    @Select(RicercaUtentiState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(GestioneUtentiState.loadingGestioneUtenti) loading$: Observable<boolean>;
    @Select(RuoliUtenteLoggatoState.ruoliPrincipali) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(RuoliUtenteLoggatoState.ruoli) ruoliUtenteLoggatoConDistaccamenti$: Observable<Ruolo[]>;
    @Select(RicercaUtentiState.sediFiltro) sediFiltro$: Observable<Ruolo[]>;
    @Select(RicercaUtentiState.sediFiltroSelezionate) sediFiltroSelezionate$: Observable<string[]>;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                private store: Store) {
        this.getDoubleMonitorMode();
        this.getDistaccamenti();
        this.getUtente();
        this.getListaUtenti();
        this.getRicerca();
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

    getDoubleMonitorMode(): void {
        this.subscriptions.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    getDistaccamenti(): void {
        this.store.dispatch(new GetDistaccamenti());
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
                }
            }, () => {
                this.store.dispatch(new ClearDataModalAddUtenteModal());
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
        aggiungiRuoloUtenteModal.componentInstance.addRuoloUtente = true;
        const data = {
            type: TipoConcorrenzaEnum.AggiungiRuoloUtente,
            value: event.codFiscale
        };
        this.store.dispatch(new AddConcorrenza([data]));
        aggiungiRuoloUtenteModal.result.then((result: { success: boolean }) => {
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.AggiungiRuoloUtente, [event.codFiscale]));
                if (result.success) {
                    this.store.dispatch(new AddRuoloUtenteGestione());
                } else if (!result.success) {
                    this.store.dispatch(new ClearDataModalAddUtenteModal());
                }
            }, () => {
                this.store.dispatch([
                    new DeleteConcorrenza(TipoConcorrenzaEnum.AggiungiRuoloUtente, [event.codFiscale]),
                    new ClearDataModalAddUtenteModal()
                ]);
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
        const data = {
            type: TipoConcorrenzaEnum.EliminaRuoloUtente,
            value: payload.codFiscale
        };
        this.store.dispatch(new AddConcorrenza([data]));
        modalConfermaAnnulla.result.then((val) => {
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.EliminaRuoloUtente, [payload.codFiscale]));
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new RemoveRuoloUtente(payload.codFiscale, payload.ruolo));
                        break;
                    case 'ko':
                        break;
                }
            }, () => {
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.EliminaRuoloUtente, [payload.codFiscale]));
            }
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
        const data = {
            type: TipoConcorrenzaEnum.EliminaUtente,
            value: payload.codFiscale
        };
        this.store.dispatch(new AddConcorrenza([data]));
        modalConfermaAnnulla.result.then((val) => {
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.EliminaUtente, [payload.codFiscale]));
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new RemoveUtente(payload.codFiscale));
                        break;
                    case 'ko':
                        break;
                }
            }, () => {
                this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.EliminaUtente, [payload.codFiscale]));
            }
        );
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetUtentiGestione(page));
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

    getListaUtenti(): void {
        this.subscriptions.add(
            this.listaUtenti$.subscribe((listaUtenti: Utente[]) => {
                this.listaUtenti = listaUtenti;
            })
        );
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca || ricerca === '') {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetUtentiGestione());
                }
            })
        );
    }
}
