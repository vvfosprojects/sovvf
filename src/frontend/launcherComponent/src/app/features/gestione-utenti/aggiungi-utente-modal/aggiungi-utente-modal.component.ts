import { Component } from '@angular/core';
import { Utente } from '../../../shared/model/utente.model';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { TreeviewSelezione } from '../../../shared/model/treeview-selezione.model';
import { FormControl, FormGroup } from '@angular/forms';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { RuoliState } from '../store/states/ruoli/ruoli.state';
import { GetUtenti } from '../../../shared/store/actions/utenti/utenti.actions';
import { UtentiState } from '../../../shared/store/states/utenti/utenti.state';

@Component({
    selector: 'app-aggiungi-utente-modal',
    templateUrl: './aggiungi-utente-modal.component.html',
    styleUrls: ['./aggiungi-utente-modal.component.css']
})
export class AggiungiUtenteModalComponent {

    @Select(UtentiState.utenti) listaUtenti$: Observable<Utente[]>;
    @Select(RuoliState.ruoli) ruoli$: Observable<any[]>;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];

    nuovoUtenteForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal) {
        this.store.dispatch(new GetUtenti());
        this.inizializzaSediTreeview();
        this.initForm();
    }

    initForm() {
        this.nuovoUtenteForm = new FormGroup({
            utente: new FormControl(),
            sedi: new FormControl(),
            ruolo: new FormControl(),
            permessi: new FormControl()
        });
    }

    get f() {
        return this.nuovoUtenteForm.controls;
    }

    inizializzaSediTreeview() {
        this.subscription.add(
            this.listeSediNavbar$.subscribe((listaSedi: TreeItem) => {
                this.listeSediNavbar = [];
                this.listeSediNavbar[0] = new TreeviewItem(listaSedi);
            })
        );
    }

    onPatchSedi(event: TreeviewSelezione[]) {
        this.f.sedi.patchValue(event);
        console.log('Patch Sedi', event);
        console.log('Sedi Selezionate', this.f.sedi.value);
    }

    onConferma() {
        this.submitted = true;

        if (this.nuovoUtenteForm.invalid) {
            return;
        }

        console.log(this.nuovoUtenteForm.value);

        //     let utente: Utente;
        //     // let sede: Sede;
        //
        //     utente = this.utenti.find(value => value.id === this.idUtenteSelezionato);
        //     const nomeCognome = utente.cognome.split(' ');
        //     // sede = this.sedi.find(value => value.codice === this.codiceSedeSelezionata);
        //
        //     // console.log('Sedi selezionate', this.sediSelezionateTreeview);
        //     const nuovoRuolo = {
        //         id_utente: utente.id,
        //         nome: nomeCognome[0],
        //         cognome: nomeCognome[1],
        //         ruolo: this.ruoloSelezionato,
        //         sede: this.sediSelezionateTreeview
        //     };
        //     console.log('Ruolo da inserire', nuovoRuolo);
        //
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
    }

    closeModal(type: string) {
        this.modal.close(type);
    }
}
