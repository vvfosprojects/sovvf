import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { SediTreeviewState } from '../../store/states/sedi-treeview/sedi-treeview.state';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { TreeviewSelezione } from '../../model/treeview-selezione.model';
import { AllertaSedeModalState } from '../../store/states/allerta-sede-modal/allerta-sede-modal.state';
import { LoadingState } from '../../store/states/loading/loading.state';

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

    subscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                private modal: NgbActiveModal) {
        this.initForm();
        this.getFormValid();
    }

    initForm() {
        this.allertaSedeForm = new FormGroup({
            sedi: new FormControl()
        });
        this.allertaSedeForm = this.fb.group({
            sedi: [null, Validators.required],
        });
    }

    ngOnInit() {
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
