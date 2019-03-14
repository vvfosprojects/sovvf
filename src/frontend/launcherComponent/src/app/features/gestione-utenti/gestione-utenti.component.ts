import {Component, OnInit} from '@angular/core';
import {Utente} from 'src/app/shared/model/utente.model';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {GetUtenti} from 'src/app/features/home/store/actions/utenti/utenti.actions';
import {SetRicercaUtenti} from './store/actions/ricerca-utenti/ricerca-utenti.actons';
import {makeCopy} from '../../shared/helper/function';
import {Sede} from '../../shared/model/sede.model';
import {UtenteState} from '../navbar/operatore/store/states/utente.state';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtentiState} from '../home/store/states/utenti/utenti.state';

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
        this.store.dispatch(new GetUtenti());
    }

    onRicercaUtenti(ricerca: any) {
        this.store.dispatch(new SetRicercaUtenti(makeCopy(ricerca)));
    }

    ngOnInit(): void {
        this.user$.subscribe((utente: Utente) => {
            this.unitaOperativaAttuale = utente.sede;
        });
    }

    aggiungiUtente(AggiungiUtenteModalComponent: any) {
        this.modal.open(AggiungiUtenteModalComponent, {backdropClass: 'light-blue-backdrop', centered: true, size: 'lg'});
    }
}
