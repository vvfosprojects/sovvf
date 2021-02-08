import { Component, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ItemTriageData } from '../../interface/item-triage-data.interface';

@Component({
    selector: 'app-item-triage-modal',
    templateUrl: './item-triage-modal.component.html',
    styleUrls: ['./item-triage-modal.component.scss']
})
export class ItemTriageModalComponent implements OnInit {

    domandaTitle: string;
    rispostaTitle: string;

    primaDomanda: boolean;

    editMode: boolean;
    itemDataEdit: ItemTriageData;
    domandaSeguente: string;
    disableDomanda: boolean;

    item: TreeviewItem;

    addItemTriageForm: FormGroup;

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
    }

    ngOnInit(): void {
        this.patchForm();
        if (this.disableDomanda) {
            this.f.domandaSeguente.disable();
        }
    }

    initForm(): void {
        this.addItemTriageForm = this.fb.group({
            soccorsoAereo: new FormControl(),
            generiMezzo: new FormControl(),
            prioritaConsigliata: new FormControl(),
            domandaSeguente: new FormControl(),
            noteOperatore: new FormControl()
        });
        this.addItemTriageForm = this.fb.group({
            soccorsoAereo: [null],
            generiMezzo: [null],
            prioritaConsigliata: [null],
            domandaSeguente: [null],
            noteOperatore: [null]
        });
    }

    patchForm(): void {
        this.addItemTriageForm.patchValue({
            soccorsoAereo: this.itemDataEdit?.soccorsoAereo,
            generiMezzo: this.itemDataEdit?.generiMezzo,
            prioritaConsigliata: this.itemDataEdit?.prioritaConsigliata,
            noteOperatore: this.itemDataEdit?.noteOperatore,
            domandaSeguente: this.domandaSeguente
        });
    }

    get f(): any {
        return this.addItemTriageForm.controls;
    }

    formIsInvalid(): boolean {
        return !this.f.domandaSeguente.value && !this.f.soccorsoAereo.value && !this.f.generiMezzo.value && !this.f.prioritaConsigliata.value && !this.f.noteOperatore.value;
    }

    onConferma(): void {
        if (this.item) {
            const item = {
                value: this.item.value,
                domandaSeguente: this.f.domandaSeguente.value,
                soccorsoAereo: this.f.soccorsoAereo.value,
                generiMezzo: this.f.generiMezzo.value && this.f.generiMezzo.value.length > 0 ? this.f.generiMezzo.value : null,
                noteOperatore: this.f.noteOperatore.value,
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
            return this.domandaTitle;
        } else {
            return this.primaDomanda ? 'Inizia Triage' : 'Modifica triage';
        }
    }
}
