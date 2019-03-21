import { Component, OnInit } from '@angular/core';
import { Utente } from 'src/app/shared/model/utente.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetRicercaUtenti } from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import { makeCopy } from '../../shared/helper/function';
import { Sede } from '../../shared/model/sede.model';
import { UtenteState } from '../navbar/store/states/operatore/utente.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUtente, GetGestioneUtenti } from './store/actions/gestione-utenti/gestione-utenti.actions';
import { AggiungiUtenteModalComponent } from './aggiungi-utente-modal/aggiungi-utente-modal.component';
import { GetRuoli } from './store/actions/ruoli/ruoli.actions';
import { RuoliState } from './store/states/ruoli/ruoli.state';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit {

    @Select(UtenteState.utente) user$: Observable<Utente>;

    @Select(RuoliState.ruoli) ruoli$: Observable<Array<any>>;
    ruoli: Array<any>;

    unitaOperativaAttuale: Sede;
    subscription: Subscription = new Subscription();

    constructor(public modal: NgbModal,
                private store: Store) {
        this.store.dispatch(new GetGestioneUtenti());
        this.store.dispatch(new GetRuoli());

        this.subscription.add(
            this.ruoli$.subscribe((ruoli: Array<any>) => {
                this.ruoli = ruoli;
            })
        );
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(makeCopy(ricerca)));
    }

    ngOnInit(): void {
        this.user$.subscribe((utente: Utente) => {
            this.unitaOperativaAttuale = utente.sede;
        });
    }

    onAggiungiUtente() {
        const aggiungiUtenteModal = this.modal.open(AggiungiUtenteModalComponent, {backdropClass: 'light-blue-backdrop', centered: true, size: 'lg'});
        aggiungiUtenteModal.componentInstance.ruoli = this.ruoli;
        aggiungiUtenteModal.result.then(
            (val) => {
                switch (val[0]) {
                    case 'ok':
                        this.store.dispatch(new AddUtente(
                            val[1]
                        ));
                        break;
                }
                // console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onSetRuolo(event: any) {
        const utente = event.utente;
        const ruolo = event.ruolo;
        const sede = event.sede;
        console.log(utente.nome + ' ' + utente.cognome + ' è diventato ' + ruolo + ' nel ' + sede.descrizione);
    }

    onEliminaGestioneUtente(event: Object) {
        console.log(event);
    }
}
