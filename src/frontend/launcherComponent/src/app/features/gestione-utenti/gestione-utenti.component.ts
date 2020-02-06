import { Component, OnInit } from '@angular/core';
import { Ruolo, Utente } from 'src/app/shared/model/utente.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetRicercaUtenti } from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import { UtenteState } from '../navbar/store/states/operatore/utente.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetUtenteDetail, GetUtentiGestione, OpenModalRemoveRuoloUtente, OpenModalRemoveUtente, AddRuoloUtenteGestione } from './store/actions/gestione-utenti/gestione-utenti.actions';
import { GetRuoli } from './store/actions/ruoli/ruoli.actions';
import { RuoliState } from './store/states/ruoli/ruoli.state';
import { GestioneUtentiState } from './store/states/gestione-utenti/gestione-utenti.state';
import { RicercaUtentiState } from './store/states/ricerca-utenti/ricerca-utenti.state';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { LoadingState } from '../../shared/store/states/loading/loading.state';
import { GestioneUtenteModalComponent } from './gestione-utente-modal/gestione-utente-modal.component';

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
    @Select(PaginationState.limit) pageSize$: Observable<number>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    private subscription: Subscription = new Subscription();

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
                    this.store.dispatch(new AddRuoloUtenteGestione());
                } else if (!result.success) {
                    console.log('Modal "addUtente" chiusa con val ->', result);
                }
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
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
                    this.store.dispatch(new AddRuoloUtenteGestione({ codFiscaleUtenteVVF: codFiscaleUtenteVVF }));
                } else if (!result.success) {
                    console.log('Modal "addRuoloUtente" chiusa con val ->', result);
                }
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onDetailUtente(id: string) {
        this.store.dispatch(new GetUtenteDetail(id));
        this.subscription.add(
            this.utenteGestioneDetail$.subscribe((utente: any) => {
                if (utente) {
                    const modificaUtenteModal = this.modalService.open(GestioneUtenteModalComponent, { backdropClass: 'light-blue-backdrop', centered: true, size: 'lg' });
                    modificaUtenteModal.componentInstance.detailMode = true;
                    modificaUtenteModal.componentInstance.utenteEdit = utente;
                    modificaUtenteModal.result.then((risultatoModal: any) => {
                        console.log('Modal "detailUtente" chiusa con val ->', risultatoModal);
                    },
                        (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
                    );
                }
            })
        );
    }

    onRemoveUtente(payload: { id: string, nominativoUtente: string }) {
        this.store.dispatch(new OpenModalRemoveUtente(payload.id, payload.nominativoUtente));
    }

    onRemoveRuoloUtente(payload: { id: string, ruolo: Ruolo, nominativoUtente: string }) {
        this.store.dispatch(new OpenModalRemoveRuoloUtente(payload.id, payload.ruolo, payload.nominativoUtente));
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
