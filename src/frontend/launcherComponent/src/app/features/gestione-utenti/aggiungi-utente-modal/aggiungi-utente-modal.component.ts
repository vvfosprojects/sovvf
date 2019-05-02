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
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { TreeviewSelezione } from '../../../shared/model/treeview-selezione.model';

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
    // codiceSedeSelezionata: string;
    sediSelezionateTreeview: Array<TreeviewSelezione>;

    subscription: Subscription = new Subscription();

    // Treeview
    @Select(SediTreeviewState.listeSediNavbar) listeSedi$: Observable<TreeItem>;
    items: TreeviewItem[];

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
        // this.sedi = [
        //     {
        //         codice: '1',
        //         descrizione: 'Comando di Roma',
        //         coordinate: {
        //             latitudine: 41.89994,
        //             longitudine: 12.49127
        //         },
        //         indirizzo: 'Via Genova, 1, 00184 Roma RM',
        //         tipo: 'Comando',
        //         regione: 'Lazio',
        //         provincia: 'RM'
        //     },
        // ];
        // Treeview
        this.subscription.add(
            this.listeSedi$.subscribe((listaSedi: TreeItem) => {
                this.items = [];
                this.items[0] = new TreeviewItem(listaSedi);
            })
        );
    }

    onPatchSedi(event: TreeviewSelezione[]) {
        this.sediSelezionateTreeview = event;
        // console.log('Patch sedi', event);
        // console.log('Sedi selezionate', this.sediSelezionateTreeview);
    }

    onConferma() {
        if (this.idUtenteSelezionato && this.ruoloSelezionato && this.sediSelezionateTreeview.length > 0) {
            let utente: Utente;
            // let sede: Sede;

            utente = this.utenti.find(value => value.id === this.idUtenteSelezionato);
            const nomeCognome = utente.cognome.split(' ');
            // sede = this.sedi.find(value => value.codice === this.codiceSedeSelezionata);

            // console.log('Sedi selezionate', this.sediSelezionateTreeview);
            const nuovoRuolo = {
                id_utente: utente.id,
                nome: nomeCognome[0],
                cognome: nomeCognome[1],
                ruolo: this.ruoloSelezionato,
                sede: this.sediSelezionateTreeview
            };
            console.log('Ruolo da inserire', nuovoRuolo);

            // this.modal.close([
            //     'ok',
            //     {
            //         id_utente: utente.id,
            //         nome: nomeCognome[0],
            //         cognome: nomeCognome[1],
            //         ruolo: this.ruoloSelezionato,
            //         sede: sede
            //     }
            // ]);
        } else {
            console.error('Ci sono dei dati mancanti');
        }
    }
}
