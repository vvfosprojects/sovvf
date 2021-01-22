import { Component, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-add-item-triage-modal',
    templateUrl: './add-item-triage-modal.component.html',
    styleUrls: ['./add-item-triage-modal.component.scss']
})
export class AddItemTriageModalComponent implements OnInit {

    primaDomanda: boolean;

    tItem: TreeviewItem;

    addItemTriageForm: FormGroup;

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
    }

    ngOnInit(): void {
        console.log('tItem', this.tItem);
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

    get f(): any {
        return this.addItemTriageForm.controls;
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
            this.modal.close(item);
        } else {
            const item = {
                domandaSeguente: this.f.domandaSeguente.value
            };
            this.modal.close(item);
        }
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }

    getTitle(): string {
        return this.primaDomanda ? 'Inizia Triage' : 'Modifica triage';
    }
}
