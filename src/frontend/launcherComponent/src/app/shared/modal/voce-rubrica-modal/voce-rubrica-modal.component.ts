import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { findItem } from '../../store/states/sedi-treeview/sedi-treeview.helper';
import { RubricaState } from '../../../features/rubrica/store/states/rubrica/rubrica.state';

@Component({
    selector: 'app-voce-rubrica-modal',
    templateUrl: './voce-rubrica-modal.component.html',
    styleUrls: ['./voce-rubrica-modal.component.css']
})
export class VoceRubricaModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(RubricaState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(RubricaState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
    sediSelezionate: string;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];

    ruoli: string[] = [];

    voceRubricaForm: FormGroup;
    checkboxState: { id: string, status: boolean, label: string, disabled: boolean };
    treeviewState: { disabled: boolean };
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
        this.inizializzaSediTreeview();
        this.getSediSelezionate();
    }

    initForm() {
        this.voceRubricaForm = new FormGroup({
            descrizione: new FormControl(),
            sedi: new FormControl(),
            ricorsivo: new FormControl()
        });
        this.voceRubricaForm = this.fb.group({
            descrizione: [null, Validators.required],
            sedi: [null, Validators.required],
            ricorsivo: [true, Validators.required]
        });
        // Init disabled input
        this.checkboxState = { id: 'ricorsivo', status: this.f.ricorsivo.value, label: 'Ricorsivo', disabled: false };
        this.treeviewState = { disabled: false };
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getFormValid() {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    get f() {
        return this.voceRubricaForm.controls;
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
    }

    getSediSelezionate() {
        this.subscription.add(
            this.sediSelezionate$.subscribe((sedi: TreeviewSelezione[]) => {
                const listaSediNavbar = this.store.selectSnapshot(SediTreeviewState.listeSediNavbar);
                console.log('sedi selezionate', sedi);
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

    setRicorsivoValue(value: { id: string, status: boolean }) {
        this.checkboxState.status = value.status;
        this.f[value.id].patchValue(value.status);
        this.store.dispatch(new UpdateFormValue({
            value: {
                ...this.voceRubricaForm.value,
                ricorsivo: value.status
            },
            path: 'gestioneUtenti.voceRubricaForm'
        }));
    }

    onConferma() {
        this.submitted = true;

        if (!this.formValid) {
            return;
        }

        this.modal.close({ success: true });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }
}
