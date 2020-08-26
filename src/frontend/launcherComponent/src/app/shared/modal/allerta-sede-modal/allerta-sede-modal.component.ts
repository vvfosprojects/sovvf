import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { AllertaSedeModalState } from '../../store/states/allerta-sede-modal/allerta-sede-modal.state';
import { LoadingState } from '../../store/states/loading/loading.state';
import { findItem } from '../../store/states/sedi-treeview/sedi-treeview.helper';

@Component({
    selector: 'app-allerta-sede-modal',
    templateUrl: './allerta-sede-modal.component.html',
    styleUrls: ['./allerta-sede-modal.component.css']
})
export class AllertaSedeModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(AllertaSedeModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(AllertaSedeModalState.sedeSelezionata) sediSelezionate$: Observable<TreeviewSelezione[]>;
    sediSelezionate: string;
    @Select(SediTreeviewState.listeSediNavbar) listeSediNavbar$: Observable<TreeItem>;
    listeSediNavbar: TreeviewItem[];

    allertaSedeForm: FormGroup;
    submitted: boolean;

    codRichiesta: string;

    subscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                private modal: NgbActiveModal,
                private store: Store) {
        this.initForm();
        this.getFormValid();
        this.inizializzaSediTreeview();
        this.getSediSelezionate();
    }

    initForm() {
        this.allertaSedeForm = new FormGroup({
            codRichiesta: new FormControl(),
            sedi: new FormControl()
        });
        this.allertaSedeForm = this.fb.group({
            codRichiesta: [null, Validators.required],
            sedi: [null]
        });
    }

    ngOnInit() {
        this.f.codRichiesta.patchValue(this.codRichiesta);
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
        return this.allertaSedeForm.controls;
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

        if (!this.allertaSedeForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.allertaSedeForm.value });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }
}
