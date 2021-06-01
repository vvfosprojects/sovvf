import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PosModalState } from '../../store/states/pos-modal/pos-modal.state';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { PosInterface, TipologiaPos } from '../../interface/pos.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';

@Component({
    selector: 'app-pos-modal',
    templateUrl: './pos-modal.component.html',
    styleUrls: ['./pos-modal.component.css']
})
export class PosModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(PosModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    tipologie: Tipologia[];
    dettagliTipologie: DettaglioTipologia[];
    dettagliTipologieFiltered: DettaglioTipologia[];

    editPos: boolean;
    pos: PosInterface;

    posForm: FormGroup;
    formData: FormData;

    submitted: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getFormValid();
    }

    ngOnInit(): void {
        if (this.editPos) {
            this.updatePosForm(this.pos);
        }
        this.dettagliTipologieFiltered = this.dettagliTipologie;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.posForm = new FormGroup({
            descrizionePos: new FormControl(),
            tipologie: new FormControl(),
            tipologieDettagli: new FormControl()
        });
        this.posForm = this.fb.group({
            descrizionePos: [null, Validators.required],
            tipologie: [null, Validators.required],
            tipologieDettagli: [null]
        });
    }

    get f(): any {
        return this.posForm.controls;
    }

    updatePosForm(editPos: PosInterface): void {
        console.log('updatePosForm', editPos);
        this.store.dispatch(new UpdateFormValue({
            value: {
                descrizionePos: editPos.descrizionePos,
                tipologie: this.getTipologieFromListaTipologie(editPos),
                tipologieDettagli: this.getDettagliTipologieFromListaTipologie(editPos)
            },
            path: 'posModal.posForm'
        }));
    }

    getTipologieFromListaTipologie(pos: PosInterface): Tipologia[] {
        const tipologie = [];
        pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
            const tipologiaTrovata = tipologie?.filter((t: Tipologia) => t?.codice === '' + tipologiaPos?.codTipologia)[0];
            if (!tipologiaTrovata) {
                const tipologia = this.tipologie?.filter((t: Tipologia) => t?.codice === '' + tipologiaPos?.codTipologia)[0];
                tipologie.push(tipologia);
            }
        });
        return tipologie;
    }

    getDettagliTipologieFromListaTipologie(pos: PosInterface): DettaglioTipologia[] {
        const dettagliTipologie = [];
        pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
            tipologiaPos?.codTipologiaDettaglio?.forEach((codTipologiaDettaglio: number) => {
                const dettaglioTipologiaTrovato = dettagliTipologie?.filter((dT: DettaglioTipologia) => dT?.codiceDettaglioTipologia === tipologiaPos?.codTipologia)[0];
                if (!dettaglioTipologiaTrovato) {
                    const dettaglioTipologia = this.dettagliTipologie?.filter((dT: DettaglioTipologia) => dT?.codiceTipologia === tipologiaPos?.codTipologia && dT?.codiceDettaglioTipologia === codTipologiaDettaglio)[0];
                    dettagliTipologie.push(dettaglioTipologia);
                }
            });
        });
        return dettagliTipologie;
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    onChangeSelectedTipologie(event: any): void {
        const codTipologie = event.map((tipologia: Tipologia) => +tipologia.codice);
        this.filterDettagliTipologieByCodTipologie(codTipologie);
    }

    filterDettagliTipologieByCodTipologie(codTipologie: number[]): void {
        this.dettagliTipologieFiltered = this.dettagliTipologie;
        if (this.dettagliTipologieFiltered) {
            this.dettagliTipologieFiltered = this.dettagliTipologieFiltered.filter((dettaglioTipologia: DettaglioTipologia) => dettaglioTipologia.codiceTipologia === codTipologie[0]);
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        this.formData = new FormData();
        this.formData.append('FDFile', file);
    }

    onConfirm(): void {
        this.submitted = true;

        if (!this.posForm.valid) {
            return;
        }

        this.modal.close({ success: true, formData: this.formData });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(): void {
        this.modal.close({ success: false });
    }

    getTitle(): string {
        return !this.editPos ? 'Aggiungi nuova P.O.S.' : 'Modifica P.O.S.';
    }
}
