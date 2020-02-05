import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { TreeviewSelezione } from '../../../shared/model/treeview-selezione.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GestioneUtentiState } from '../store/states/gestione-utenti/gestione-utenti.state';
import { findItem } from '../../../shared/store/states/sedi-treeview/sedi-treeview.helper';
import { SetFormEnabled, UpdateFormValue } from '@ngxs/form-plugin';
import { UtenteVvfInterface } from '../../../shared/interface/utente-vvf.interface';
import { AddRuoloUtenteGestione, ClearUtentiVVF, GetUtentiVVF } from '../store/actions/gestione-utenti/gestione-utenti.actions';
import { Role } from '../../../shared/model/utente.model';

@Component({
    selector: 'app-gestione-utente-modal',
    templateUrl: './gestione-utente-modal.component.html',
    styleUrls: ['./gestione-utente-modal.component.css']
})
export class GestioneUtenteModalComponent implements OnInit, OnDestroy {

    @Select(GestioneUtentiState.listaUtentiVVF) listaUtentiVVF$: Observable<UtenteVvfInterface[]>;
    @Select(GestioneUtentiState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(GestioneUtentiState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
    sediSelezionate: string;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];

    ruoli: string[] = [];

    addUtenteRuoloForm: FormGroup;
    checkboxState: { id: string, status: boolean, label: string, disabled: boolean };
    treeviewState: { disabled: boolean };
    submitted: boolean;

    utenteEdit: any;
    detailMode: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
        this.checkUtenteValueChanges();
        this.getUtentiVVF();
        this.inizializzaSediTreeview();
        this.getRuoli();
        this.getSediSelezionate();
    }

    initForm() {
        this.addUtenteRuoloForm = new FormGroup({
            utente: new FormControl(),
            sedi: new FormControl(),
            soloDistaccamenti: new FormControl(),
            ruolo: new FormControl()
        });
        this.addUtenteRuoloForm = this.fb.group({
            utente: [null, Validators.required],
            sedi: [null, Validators.required],
            soloDistaccamenti: [false],
            ruolo: [null, Validators.required]
        });
        // Init disabled input
        this.checkboxState = { id: 'soloDistaccamenti', status: this.f.soloDistaccamenti.value, label: 'Solo Distaccamenti', disabled: true };
        this.treeviewState = { disabled: true };
        this.f.ruolo.disable();
    }

    ngOnInit(): void {
        // if (this.detailMode) {
        //     this.patchDetailForm();
        //     this.store.dispatch(new SetFormDisabled('gestioneUtenti.addUtenteRuoloForm'));
        // }
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(new UpdateFormValue({
            value: null,
            path: 'gestioneUtenti.addUtenteRuoloForm'
        }));
        this.store.dispatch(new SetFormEnabled('gestioneUtenti.addUtenteRuoloForm'));
        this.store.dispatch(new ClearUtentiVVF());
    }

    getFormValid() {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    // patchDetailForm() {
    //     this.store.dispatch(new UpdateFormValue({
    //         value: {
    //             ruolo: this.utenteEdit.ruolo.desc
    //         },
    //         path: 'gestioneUtenti.addUtenteRuoloForm'
    //     }));
    // }

    get f() {
        return this.addUtenteRuoloForm.controls;
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

    getUtentiVVF(search?: string) {
        const text = search && search.length > 0 ? search : null;
        this.store.dispatch(new GetUtentiVVF(text));
    }

    onSearchUtentiVVF(event: { term: string, items: any[] }) {
        this.getUtentiVVF(event.term);
    }

    trackByFn(item: UtenteVvfInterface) {
        return item.codFiscale;
    }

    getRuoli() {
        Object.values(Role).forEach((role: string) => {
            const splittedRole = role.split(/(?=[A-Z])/);
            let finalRole = '';
            splittedRole.forEach((val: string, index) => {
                if (index !== 0) {
                    finalRole = finalRole + ' ';
                }
                finalRole = finalRole + val;
            });
            this.ruoli.push(finalRole);
        });
    }

    setOnlyDistaccamentiValue(value: { id: string, status: boolean }) {
        this.checkboxState.status = value.status;
        this.f[value.id].patchValue(value.status);
        this.store.dispatch(new UpdateFormValue({
            value: {
                ...this.addUtenteRuoloForm.value,
                'soloDistaccamenti': value.status
            },
            path: 'gestioneUtenti.addUtenteRuoloForm'
        }));
    }

    checkUtenteValueChanges() {
        this.f.utente.valueChanges.subscribe((value: any) => {
            if (value) {
                this.checkboxState.disabled = false;
                this.treeviewState.disabled = false;
                this.f.ruolo.enable();
            } else {
                this.checkboxState.disabled = true;
                this.treeviewState.disabled = true;
                this.f.ruolo.disable();
            }
        });
    }

    onConferma() {
        this.submitted = true;

        if (!this.formValid) {
            return;
        }

        this.store.dispatch(new AddRuoloUtenteGestione());
        this.modal.close();
    }

    closeModal(type: string) {
        this.modal.close(type);
    }
}
