import { Component, OnDestroy, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ItemTriageData } from '../../interface/item-triage-data.interface';
import { GenereMezzo } from '../../interface/genere-mezzo.interface';
import { Select, Store } from '@ngxs/store';
import { TriageCrudState } from '../../store/states/triage-crud/triage-crud.state';
import { Observable, Subscription } from 'rxjs';
import { ClearGeneriMezzo } from '../../store/actions/triage-crud/triage-crud.actions';
import { NecessitaSoccorsoAereoEnum } from '../../enum/necessita-soccorso-aereo.enum';

@Component({
    selector: 'app-item-triage-modal',
    templateUrl: './item-triage-modal.component.html',
    styleUrls: ['./item-triage-modal.component.scss']
})
export class ItemTriageModalComponent implements OnInit, OnDestroy {

    @Select(TriageCrudState.generiMezzo) generiMezzo$: Observable<GenereMezzo[]>;
    generiMezzo: GenereMezzo[];

    domandaTitle: string;
    rispostaTitle: string;

    primaDomanda: boolean;

    editMode: boolean;

    itemDataEdit: ItemTriageData;

    domandaSeguente: string;
    disableDomanda: boolean;

    item: TreeviewItem;

    addItemTriageForm: FormGroup;

    NecessitaSoccorsoAereoValues = Object.values(NecessitaSoccorsoAereoEnum);

    private subscription: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder,
                private store: Store) {
        this.initForm();
        if (!this.primaDomanda) {
            this.getGeneriMezzo();
        }
    }

    ngOnInit(): void {
        this.patchForm();
        if (this.disableDomanda) {
            this.f.domandaSeguente.disable();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearGeneriMezzo());
    }

    getGeneriMezzo(): void {
        this.subscription.add(
            this.generiMezzo$.subscribe((generiMezzo: GenereMezzo[]) => {
                this.generiMezzo = generiMezzo;
            })
        );
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
