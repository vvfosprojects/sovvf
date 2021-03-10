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

    parentItemData: ItemTriageData;

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
            noteOperatore: new FormControl(),
            domandaSeguente: new FormControl()
        });
        this.addItemTriageForm = this.fb.group({
            soccorsoAereo: [null],
            generiMezzo: [null],
            prioritaConsigliata: [null],
            noteOperatore: [null],
            domandaSeguente: [null]
        });
    }

    patchForm(): void {
        const soccorsoAereo = this.itemDataEdit?.soccorsoAereo ? this.itemDataEdit?.soccorsoAereo : this.parentItemData?.soccorsoAereo;
        const generiMezzo = this.itemDataEdit?.generiMezzo ? this.itemDataEdit?.generiMezzo : this.parentItemData?.generiMezzo;
        const prioritaConsigliata = this.itemDataEdit?.prioritaConsigliata ? this.itemDataEdit?.prioritaConsigliata : this.parentItemData?.prioritaConsigliata;
        const noteOperatore = this.itemDataEdit?.noteOperatore ? this.itemDataEdit?.noteOperatore : this.parentItemData?.noteOperatore;
        this.addItemTriageForm.patchValue({
            soccorsoAereo,
            generiMezzo,
            prioritaConsigliata,
            noteOperatore,
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
        if (this.item && this.parentItemData && this.getParentItemDataDiffs()) {
            const item = {
                value: this.item.value,
                domandaSeguente: this.f.domandaSeguente.value,
                soccorsoAereo: this.getItemDataDiffs().soccorsoAereo,
                generiMezzo: this.getItemDataDiffs().generiMezzo && this.getItemDataDiffs().generiMezzo.length > 0 ? this.getItemDataDiffs().generiMezzo : null,
                noteOperatore: this.getItemDataDiffs().noteOperatore,
                prioritaConsigliata: this.getItemDataDiffs().prioritaConsigliata
            };
            this.modal.close({ success: true, data: item });
        } else if (this.item && !this.parentItemData) {
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

    getParentItemDataDiffs(): boolean {
        let diffs = false;

        if (this.parentItemData?.soccorsoAereo !== this.f.soccorsoAereo.value) {
            diffs = true;
        }

        if (this.parentItemData?.generiMezzo !== this.f.generiMezzo.value) {
            diffs = true;
        }

        if (this.parentItemData?.prioritaConsigliata !== this.f.prioritaConsigliata.value) {
            diffs = true;
        }

        if (this.parentItemData?.noteOperatore !== this.f.noteOperatore.value) {
            diffs = true;
        }

        return diffs;
    }

    getItemDataDiffs(): ItemTriageData {
        const itemDiffs = {
            soccorsoAereo: null,
            generiMezzo: null,
            noteOperatore: null,
            prioritaConsigliata: null
        } as ItemTriageData;

        if (this.parentItemData?.soccorsoAereo !== this.f.soccorsoAereo.value) {
            itemDiffs.soccorsoAereo = this.f.soccorsoAereo.value;
        }

        if (this.parentItemData?.generiMezzo !== this.f.generiMezzo.value) {
            itemDiffs.generiMezzo = this.f.generiMezzo.value;
        }

        if (this.parentItemData?.prioritaConsigliata !== this.f.prioritaConsigliata.value) {
            itemDiffs.prioritaConsigliata = this.f.prioritaConsigliata.value;
        }

        if (this.parentItemData?.noteOperatore !== this.f.noteOperatore.value) {
            itemDiffs.noteOperatore = this.f.noteOperatore.value;
        }

        return itemDiffs;
    }

    getTitle(): string {
        if (this.domandaTitle) {
            return this.domandaTitle;
        } else {
            return this.primaDomanda ? 'Inizia Triage' : 'Modifica triage';
        }
    }
}
