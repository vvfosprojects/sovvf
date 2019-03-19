import { Component, OnInit } from '@angular/core';
import { Utente } from 'src/app/shared/model/utente.model';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SetRicercaUtenti } from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import { makeCopy } from '../../shared/helper/function';
import { Sede } from '../../shared/model/sede.model';
import { UtenteState } from '../navbar/store/states/operatore/utente.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetGestioneUtenti } from './store/actions/gestione-utenti/gestione-utenti.actions';
import { AggiungiUtenteModalComponent } from './aggiungi-utente-modal/aggiungi-utente-modal.component';

@Component({
    selector: 'app-gestione-utenti',
    templateUrl: './gestione-utenti.component.html',
    styleUrls: ['./gestione-utenti.component.css']
})
export class GestioneUtentiComponent implements OnInit {

    @Select(UtenteState.utente) user$: Observable<Utente>;

    unitaOperativaAttuale: Sede;

    constructor(public modal: NgbModal,
                private store: Store) {
        this.store.dispatch(new GetGestioneUtenti());
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(makeCopy(ricerca)));
    }

    ngOnInit(): void {
        this.user$.subscribe((utente: Utente) => {
            this.unitaOperativaAttuale = utente.sede;
        });
    }

    aggiungiUtente() {
        this.modal.open(AggiungiUtenteModalComponent, {backdropClass: 'light-blue-backdrop', centered: true, size: 'lg'});
    }

    onSetRuolo(event: any) {
        const utente = event.utente;
        const ruolo = event.ruolo;
        const sede = event.sede;
        console.log(utente.nome + ' ' + utente.cognome + ' è diventato ' + ruolo + ' nel ' + sede.descrizione);
    }
}
