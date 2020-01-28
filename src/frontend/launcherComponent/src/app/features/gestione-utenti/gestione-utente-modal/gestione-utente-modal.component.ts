import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Utente } from '../../../shared/model/utente.model';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { TreeviewSelezione } from '../../../shared/model/treeview-selezione.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { RuoliState } from '../store/states/ruoli/ruoli.state';
import { GetUtenti } from '../../../shared/store/actions/utenti/utenti.actions';
import { UtentiState } from '../../../shared/store/states/utenti/utenti.state';
import { findItem } from '../../../shared/store/states/sedi-treeview/sedi-treeview.helper';
import { SetFormDisabled, SetFormEnabled, UpdateFormValue } from '@ngxs/form-plugin';

@Component({
    selector: 'app-gestione-utente-modal',
    templateUrl: './gestione-utente-modal.component.html',
    styleUrls: ['./gestione-utente-modal.component.css']
})
export class GestioneUtenteModalComponent implements OnInit, OnDestroy {

    @Select(UtentiState.utenti) listaUtenti$: Observable<Utente[]>;
    @Select(RuoliState.ruoli) ruoli$: Observable<any[]>;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];
    @Select(GestioneUtentiState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
    sediSelezionate: string;

    gestioneUtenteForm: FormGroup;
    submitted: boolean;

    utenteEdit: Utente;
    editMode: boolean;
    detailMode: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.inizializzaSediTreeview();
        this.getSediSelezionate();
    }

    initForm() {
        this.gestioneUtenteForm = new FormGroup({
            utente: new FormControl(),
            sedi: new FormControl(),
            ruolo: new FormControl()
        });
        this.gestioneUtenteForm = this.fb.group({
            utente: [null, Validators.required],
            sedi: [null, Validators.required],
            ruolo: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.editMode) {
            this.patchEditForm();
        } else if (this.detailMode) {
            this.patchEditForm();
            this.store.dispatch(new SetFormDisabled('gestioneUtenti.nuovoUtenteForm'));
        }
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(new UpdateFormValue({
            value: null,
            path: 'gestioneUtenti.nuovoUtenteForm'
        }));
        this.store.dispatch(new SetFormEnabled('gestioneUtenti.nuovoUtenteForm'));
    }

    patchEditForm() {
        // this.store.dispatch(new UpdateFormValue({
        //     value: {
        //         utente: this.utenteEdit.id,
        //         ruolo: this.utenteEdit.ruolo.desc
        //     },
        //     path: 'gestioneUtenti.nuovoUtenteForm'
        // }));
    }

    get f() {
        return this.gestioneUtenteForm.controls;
    }

    inizializzaSediTreeview() {
        this.subscription.add(
            this.listeSediNavbar$.subscribe((listaSedi: TreeItem) => {
                this.listeSediNavbar = [];
                if (this.detailMode) {
                    listaSedi.disabled = true;
                }
                this.listeSediNavbar[0] = new TreeviewItem(listaSedi);
            })
        );
    }

    onPatchSedi(event: TreeviewSelezione[]) {
        this.f.sedi.patchValue(event);
        console.log('Patch Sedi', event);
        console.log('Sedi Selezionate', this.f.sedi.value);
    }

    getSediSelezionate() {
        this.subscription.add(
            this.sediSelezionate$.subscribe((sedi: TreeviewSelezione[]) => {
                const listaSediNavbar = this.store.selectSnapshot(SediTreeviewState.listeSediNavbar);
                if (listaSediNavbar && sedi && sedi.length >= 0) {
                    switch (sedi.length) {
                        case 0:
                            this.sediSelezionate = 'nessuna sede selezionata';
                            break;
                        case 1:
                            this.sediSelezionate = findItem(listaSediNavbar, sedi[0].idSede).text;
                            break;
                        default:
                            this.sediSelezionate = 'più sedi selezionate';
                            break;
                    }
                } else {
                    this.sediSelezionate = 'Caricamento...';
                }
            })
        );
    }

    onConferma() {
        this.submitted = true;

        if (this.gestioneUtenteForm.invalid) {
            return;
        }

        console.log(this.gestioneUtenteForm.value);

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
