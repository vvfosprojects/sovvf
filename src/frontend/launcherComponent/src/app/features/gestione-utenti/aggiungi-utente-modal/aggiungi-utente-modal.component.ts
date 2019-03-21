import { Component, OnInit } from '@angular/core';
import { Role, Utente } from '../../../shared/model/utente.model';
import { Sede } from '../../../shared/model/sede.model';
import { Select, Store } from '@ngxs/store';
import { GetUtenti } from '../../home/store/actions/utenti/utenti.actions';
import { UtentiState } from '../../home/store/states/utenti/utenti.state';
import { Observable, Subscription } from 'rxjs';
import { makeCopy } from '../../../shared/helper/function';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RuoliState } from '../store/states/ruoli/ruoli.state';
import { AddUtente } from '../store/actions/gestione-utenti/gestione-utenti.actions';

@Component({
    selector: 'app-aggiungi-utente-modal',
    templateUrl: './aggiungi-utente-modal.component.html',
    styleUrls: ['./aggiungi-utente-modal.component.css']
})
export class AggiungiUtenteModalComponent {

    @Select(UtentiState.utenti) utenti$: Observable<Utente[]>;
    utenti: Utente[];
    ruoli: Array<any>;
    sedi: Sede[];

    idUtenteSelezionato: string;
    ruoloSelezionato: Role;
    codiceSedeSelezionata: string;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                public modal: NgbActiveModal) {
        this.store.dispatch(new GetUtenti());
        this.subscription.add(
            this.utenti$.subscribe((utenti: Utente[]) => {
                this.utenti = makeCopy(utenti);
                this.utenti.map((i) => {
                    i.cognome = i.nome + ' ' + i.cognome;
                });
            })
        );
        this.inizializzaSedi();
    }

    inizializzaSedi() {
        this.sedi = [
            {
                codice: '1',
                descrizione: 'Comando di Roma',
                coordinate: {
                    latitudine: 41.89994,
                    longitudine: 12.49127
                },
                indirizzo: 'Via Genova, 1, 00184 Roma RM',
                tipo: 'Comando',
                regione: 'Lazio',
                provincia: 'RM'
            },
        ];
    }

    onConferma() {
        let utente: Utente;
        let sede: Sede;

        utente = this.utenti.find(value => value.id === this.idUtenteSelezionato);
        const nomeCognome = utente.cognome.split(' ');

        sede = this.sedi.find(value => value.codice === this.codiceSedeSelezionata);

        this.modal.close([
            'ok',
            {
                id_utente: utente.id,
                nome: nomeCognome[0],
                cognome: nomeCognome[1],
                ruolo: this.ruoloSelezionato,
                sede: sede
            }
        ]);
    }
}
