import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { LoadingState } from '../../../../shared/store/states/loading/loading.state';
import { ImportTriageModalState } from '../../store/states/import-triage-modal-state';
import { ClearErroreImportTriage, GetAllDettagliTipologiaImportTriage, ImportTriageByCodDettaglioTipologia } from '../../store/actions/import-triage-modal.actions';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { TriageCrudState } from '../../../../shared/store/states/triage-crud/triage-crud.state';

@Component({
    selector: 'app-import-triage-modal',
    templateUrl: './import-triage-modal.component.html',
    styleUrls: ['./import-triage-modal.component.css']
})
export class ImportTriageModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(ImportTriageModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(ImportTriageModalState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;
    dettagliTipologie: DettaglioTipologia[];
    @Select(ImportTriageModalState.errore) errore$: Observable<string>;
    errore: string;

    importTriageForm: FormGroup;
    submitted: boolean;

    subscriptions: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                private modal: NgbActiveModal,
                private store: Store) {
        this.initForm();
        this.getFormValid();
        this.getDettagliTipologie();
        this.getErrore();
    }

    initForm(): void {
        this.importTriageForm = new FormGroup({
            dettaglioTipologia: new FormControl(),
            codiceDettaglioTipologia: new FormControl(),
            codTipologia: new FormControl()
        });
        this.importTriageForm = this.fb.group({
            dettaglioTipologia: [null, Validators.required],
            codiceDettaglioTipologia: [null, Validators.required],
            codTipologia: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.store.dispatch(new GetAllDettagliTipologiaImportTriage());
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getFormValid(): void {
        this.subscriptions.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    getDettagliTipologie(): void {
        this.subscriptions.add(
            this.dettagliTipologie$.subscribe((dettagliTipologie: DettaglioTipologia[]) => {
                if (dettagliTipologie?.length) {
                    const dettaglioTipologiaSelezionatoCrudTriage = this.store.selectSnapshot(TriageCrudState.dettaglioTipologia);
                    if (dettaglioTipologiaSelezionatoCrudTriage) {
                        this.dettagliTipologie = dettagliTipologie.filter((dettaglioTipologia: DettaglioTipologia) => dettaglioTipologia.codiceDettaglioTipologia !== dettaglioTipologiaSelezionatoCrudTriage.codiceDettaglioTipologia);
                    } else {
                        this.dettagliTipologie = dettagliTipologie;
                    }
                } else {
                    this.dettagliTipologie = null;
                }
            })
        );
    }

    getErrore(): void {
        this.subscriptions.add(
            this.errore$.subscribe((errore: string) => {
                this.errore = errore;
            })
        );
    }

    get f(): any {
        return this.importTriageForm.controls;
    }

    onChangeDettaglioTipologia(dettaglioTipologia: DettaglioTipologia): void {
        if (dettaglioTipologia) {
            this.f.dettaglioTipologia.patchValue(dettaglioTipologia);
            this.f.codiceDettaglioTipologia.patchValue(dettaglioTipologia.codiceDettaglioTipologia);
            this.f.codTipologia.patchValue(dettaglioTipologia.codiceTipologia);
        } else {
            this.f.dettaglioTipologia.patchValue(null);
            this.f.codiceDettaglioTipologia.patchValue(null);
            this.f.codTipologia.patchValue(null);
        }
        this.store.dispatch(new ClearErroreImportTriage());
    }

    onConferma(): void {
        this.submitted = true;
        this.store.dispatch(new ImportTriageByCodDettaglioTipologia());
    }

    onDismiss(): void {
        this.modal.dismiss(
            'ko'
        );
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }
}
