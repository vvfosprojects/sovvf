import { Component, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-item-triage-modal',
    templateUrl: './item-triage-modal.component.html',
    styleUrls: ['./item-triage-modal.component.scss']
})
export class ItemTriageModalComponent implements OnInit {

    domandaTitle: string;
    rispostaTitle: string;

    primaDomanda: boolean;
    itemEdit: any;
    disableDomanda: any;

    tItem: TreeviewItem;

    addItemTriageForm: FormGroup;

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
    }

    ngOnInit(): void {
        if (this.itemEdit) {
            this.patchForm();
        }
        if (this.disableDomanda) {
            this.f.domandaSeguente.disable();
        }
    }

    initForm(): void {
        this.addItemTriageForm = this.fb.group({
            domandaSeguente: new FormControl(),
            soccorsoAereo: new FormControl(),
            generiMezzo: new FormControl(),
            prioritaConsigliata: new FormControl()
        });
        this.addItemTriageForm = this.fb.group({
            domandaSeguente: [null],
            soccorsoAereo: [null],
            generiMezzo: [null],
            prioritaConsigliata: [null]
        });
    }

    patchForm(): void {
        this.addItemTriageForm.patchValue({
            domandaSeguente: this.itemEdit.domandaSeguente,
            soccorsoAereo: this.itemEdit.soccorsoAereo,
            generiMezzo: this.itemEdit.generiMezzo,
            prioritaConsigliata: this.itemEdit.prioritaConsigliata
        });
    }

    get f(): any {
        return this.addItemTriageForm.controls;
    }

    formIsInvalid(): boolean {
        return !this.f.domandaSeguente.value && !this.f.soccorsoAereo.value && !this.f.generiMezzo.value && !this.f.prioritaConsigliata.value;
    }

    onConferma(): void {
        if (this.tItem) {
            const item = {
                value: this.tItem.value,
                domandaSeguente: this.f.domandaSeguente.value,
                soccorsoAereo: this.f.soccorsoAereo.value,
                generiMezzo: this.f.generiMezzo.value,
                prioritaConsigliata: this.f.prioritaConsigliata.value
            };
            this.modal.close({ success: true, data: item });
        } else {
            const item = {
                domandaSeguente: this.f.domandaSeguente.value
            };
            this.modal.close({ success: true, data: item });
        }
    }

    closeModal(type: string): void {
        this.modal.close({ success: false, data: type });
    }

    getTitle(): string {
        if (this.domandaTitle) {
            return 'Domanda Selezionata =>' + this.domandaTitle;
        } else {
            return this.primaDomanda ? 'Inizia Triage' : 'Modifica triage';
        }
    }
}
