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

    risposte = [
        'Si',
        'No',
        'Non lo so'
    ];

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
            noteUtente: new FormControl(),
            domandaSeguente: new FormControl(),
            rispostePersonalizzate: new FormControl(),
            risposta1: new FormControl(),
            risposta2: new FormControl(),
            risposta3: new FormControl(),
            risposta4: new FormControl(),
        });
        this.addItemTriageForm = this.fb.group({
            soccorsoAereo: [null],
            generiMezzo: [null],
            prioritaConsigliata: [null],
            noteOperatore: [null],
            noteUtente: [null],
            domandaSeguente: [null],
            rispostePersonalizzate: [false],
            risposta1: [this.risposte[0]],
            risposta2: [this.risposte[1]],
            risposta3: [this.risposte[2]]
        });
    }

    patchForm(): void {
        const soccorsoAereo = this.itemDataEdit?.soccorsoAereo ? this.itemDataEdit?.soccorsoAereo : this.parentItemData?.soccorsoAereo;
        const generiMezzo = this.itemDataEdit?.generiMezzo ? this.itemDataEdit?.generiMezzo : this.parentItemData?.generiMezzo;
        const prioritaConsigliata = this.itemDataEdit?.prioritaConsigliata ? this.itemDataEdit?.prioritaConsigliata : this.parentItemData?.prioritaConsigliata;
        const noteOperatore = this.itemDataEdit?.noteOperatore ? this.itemDataEdit?.noteOperatore : this.parentItemData?.noteOperatore;
        const noteUtente = this.itemDataEdit?.noteUtente ? this.itemDataEdit?.noteUtente : this.parentItemData?.noteUtente;
        this.addItemTriageForm.patchValue({
            soccorsoAereo,
            generiMezzo,
            prioritaConsigliata,
            noteOperatore,
            noteUtente,
            domandaSeguente: this.domandaSeguente
        });
    }

    get f(): any {
        return this.addItemTriageForm.controls;
    }

    formIsInvalid(): boolean {
        return !this.f.domandaSeguente.value && !this.f.soccorsoAereo.value && !this.f.generiMezzo.value?.length && !this.f.prioritaConsigliata.value && !this.f.noteOperatore.value && !this.f.noteUtente.value;
    }

    onCheckRispostePersonalizzate(event: any): void {
        this.f.rispostePersonalizzate.patchValue(event.status);
    }

    addRisposta(): void {
        this.risposte.push('');
        this.addItemTriageForm.addControl('risposta' + this.risposte.length, new FormControl(''));
    }

    onConferma(): void {
        const risposte = [];
        this.risposte.forEach((risposta: string, index: number) => {
            risposte.push(this.f['risposta' + (index + 1)].value);
        });

        if (this.item && !this.parentItemData || (this.parentItemData && this.getParentItemDataDiffs())) {
            const item = {
                value: this.item.value,
                soccorsoAereo: this.f.soccorsoAereo.value,
                generiMezzo: this.f.generiMezzo.value && this.f.generiMezzo.value.length > 0 ? this.f.generiMezzo.value : null,
                noteOperatore: this.f.noteOperatore.value,
                noteUtente: this.f.noteUtente.value,
                prioritaConsigliata: this.f.prioritaConsigliata.value,
                domandaSeguente: this.f.domandaSeguente.value,
                rispostePersonalizzate: this.f.rispostePersonalizzate.value ? risposte : null
            };
            this.modal.close({ success: true, data: item });
        } else if (this.item && !this.parentItemData || (this.parentItemData && !this.getParentItemDataDiffs())) {
            const item = {
                value: this.item.value,
                soccorsoAereo: null,
                generiMezzo: null,
                noteOperatore: null,
                noteUtente: null,
                prioritaConsigliata: null,
                domandaSeguente: this.f.domandaSeguente.value,
                rispostePersonalizzate: this.f.rispostePersonalizzate.value ? risposte : null
            };
            this.modal.close({ success: true, data: item });
        } else {
            const item = {
                domandaSeguente: this.f.domandaSeguente.value,
                rispostePersonalizzate: this.f.rispostePersonalizzate.value ? risposte : null
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

        if (!isEqual(this.parentItemData?.generiMezzo, this.f.generiMezzo.value)) {
            diffs = true;
        }

        if (this.parentItemData?.prioritaConsigliata !== this.f.prioritaConsigliata.value) {
            diffs = true;
        }

        if (this.parentItemData?.noteOperatore !== this.f.noteOperatore.value) {
            diffs = true;
        }

        if (this.parentItemData?.noteUtente !== this.f.noteUtente.value) {
            diffs = true;
        }

        return diffs;

        function isEqual(a: string[], b: string[]): boolean {
            if (!a?.length && !b?.length) {
                return true;
            } else if (a?.length !== b?.length) {
                return false;
            } else {
                for (let i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
    }

    getTitle(): string {
        if (this.domandaTitle) {
            return this.domandaTitle;
        } else {
            return this.primaDomanda ? 'Inizia Triage' : 'Modifica triage';
        }
    }
}
