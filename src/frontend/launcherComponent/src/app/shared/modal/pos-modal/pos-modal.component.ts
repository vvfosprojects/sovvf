import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from '../../store/states/loading/loading.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PosModalState } from '../../store/states/pos-modal/pos-modal.state';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { PosInterface } from '../../interface/pos.interface';
import { getDettagliTipologieFromListaTipologie, getTipologieFromListaTipologie } from '../../helper/function-pos';
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
    posFdFile: Blob;
    modifyFDFile: boolean;

    posForm: FormGroup;
    formData: FormData;

    submitted: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getFormValid();
        this.dettagliTipologieFiltered = this.dettagliTipologie;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.posForm = new FormGroup({
            descrizionePos: new FormControl(),
            tipologie: new FormControl(),
            tipologieDettagli: new FormControl(),
            file: new FormControl()
        });
        this.posForm = this.fb.group({
            descrizionePos: [null, Validators.required],
            tipologie: [null, Validators.required],
            tipologieDettagli: [null, Validators.required],
            file: [null, Validators.required]
        });

        if (this.editPos) {
            this.updatePosForm(this.pos);
        } else {
            this.f.tipologieDettagli.disable();
        }
    }

    get f(): any {
        return this.posForm.controls;
    }

    toggleModifyFDFile(): void {
        this.modifyFDFile = !this.modifyFDFile;
    }

    updatePosForm(editPos: PosInterface): void {
        console.log('updatePosForm', editPos);
        this.posForm.patchValue({
            descrizionePos: editPos.descrizionePos,
            tipologie: this.getTipologieFromListaTipologie(editPos, this.tipologie),
            tipologieDettagli: this.getDettagliTipologieFromListaTipologie(editPos, this.dettagliTipologie),
            file: this.posFdFile
        });

        this.store.dispatch(new UpdateFormValue({
            value: {
                descrizionePos: editPos.descrizionePos,
                tipologie: this.getTipologieFromListaTipologie(editPos, this.tipologie),
                tipoglieDettagli: this.getDettagliTipologieFromListaTipologie(editPos, this.dettagliTipologie),
                file: this.posFdFile
            },
            path: 'posModal.posForm'
        }));

        if (!this.formData) {
            this.formData = new FormData();
            this.formData.append('FDFile', this.posFdFile, this.pos.fileName);
        }
    }

    getTipologieFromListaTipologie(pos: PosInterface, tipologie: Tipologia[]): Tipologia[] {
        return getTipologieFromListaTipologie(pos, tipologie);
    }

    getDettagliTipologieFromListaTipologie(pos: PosInterface, dettagliTipologie: DettaglioTipologia[]): DettaglioTipologia[] {
        return getDettagliTipologieFromListaTipologie(pos, dettagliTipologie);
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    onChangeSelectedTipologie(event: any): void {
        if (event?.length) {
            this.f.tipologieDettagli.enable();
        } else {
            this.f.tipologieDettagli.disable();
        }
        this.f.tipologieDettagli.patchValue(null);
        const codTipologie = event.map((tipologia: Tipologia) => +tipologia.codice);
        this.filterDettagliTipologieByCodTipologie(codTipologie);
    }

    filterDettagliTipologieByCodTipologie(codTipologie: number[]): void {
        this.dettagliTipologieFiltered = [];
        if (this.dettagliTipologieFiltered) {
            codTipologie.forEach((codTipologia: number) => {
                this.dettagliTipologie.forEach((dettaglioTipologia: DettaglioTipologia) => {
                    const exists = this.dettagliTipologieFiltered.indexOf(dettaglioTipologia) !== -1;
                    if (!exists && dettaglioTipologia.codiceTipologia === codTipologia) {
                        this.dettagliTipologieFiltered.push(dettaglioTipologia);
                    }
                });
            });
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        this.f.file.patchValue(file);
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
        return !this.editPos ? 'Aggiungi nuova P.O.S.' : 'Modifica ' + this.pos.descrizionePos;
    }
}
