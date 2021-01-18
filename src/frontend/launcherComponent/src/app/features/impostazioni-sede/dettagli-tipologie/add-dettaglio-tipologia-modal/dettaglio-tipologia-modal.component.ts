import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../../../shared/store/states/loading/loading.state';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { DettaglioTipologiaModalState } from '../../store/states/dettaglio-tipologia-modal-state';
import { TipologieState } from '../../../../shared/store/states/tipologie/tipologie.state';
import { Tipologia } from '../../../../shared/model/tipologia.model';

@Component({
    selector: 'app-dettaglio-tipologia-modal',
    templateUrl: './dettaglio-tipologia-modal.component.html',
    styleUrls: ['./dettaglio-tipologia-modal.component.scss']
})
export class DettaglioTipologiaModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(DettaglioTipologiaModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    editDettaglioTipologia: DettaglioTipologia;

    dettaglioTipologiaForm: FormGroup;
    submitted: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
    }

    initForm(): void {
        this.dettaglioTipologiaForm = new FormGroup({
            codTipologia: new FormControl(),
            descrizione: new FormControl(),
            codiceDettaglioTipologia: new FormControl(),
            id: new FormControl()
        });
        this.dettaglioTipologiaForm = this.fb.group({
            codTipologia: [null, Validators.required],
            descrizione: [null, Validators.required],
            codiceDettaglioTipologia: [null],
            id: [null],
        });
    }

    ngOnInit(): void {
        if (this.editDettaglioTipologia) {
            this.updateDettaglioTipologiaForm(this.editDettaglioTipologia);
        }
    }

    ngOnDestroy(): void {
        this.dettaglioTipologiaForm.reset();
        this.subscription.unsubscribe();
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    get f(): any {
        return this.dettaglioTipologiaForm.controls;
    }

    updateDettaglioTipologiaForm(editDettaglioTipologia: DettaglioTipologia): void {
        console.log('updateDettaglioTipologiaForm', editDettaglioTipologia);
        this.store.dispatch(new UpdateFormValue({
            value: {
                codTipologia: editDettaglioTipologia.codiceTipologia.toString(),
                descrizione: editDettaglioTipologia.descrizione,
                codiceDettaglioTipologia: editDettaglioTipologia.codiceDettaglioTipologia.toString(),
                id: editDettaglioTipologia.id
            },
            path: 'dettaglioTipologiaModal.dettaglioTipologiaForm'
        }));
    }

    onConfermaERiapri(): void {
        this.submitted = true;

        if (!this.formValid) {
            return;
        }

        this.modal.close({ success: true, openAgain: true });
    }

    onConfermaEChiudi(): void {
        this.submitted = true;

        if (!this.formValid) {
            return;
        }

        this.modal.close({ success: true, openAgain: false });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }

    getTitle(): string {
        let title = 'Aggiungi Dettaglio Tipologia';
        if (this.editDettaglioTipologia) {
            title = 'Modifica ' + this.editDettaglioTipologia.descrizione;
        }
        return title;
    }

}
