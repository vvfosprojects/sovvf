import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { ClassificazioneSchedaContatto } from '../../enum/classificazione-scheda-contatto.enum';
import { Priorita } from '../../model/sintesi-richiesta.model';
import { CheckboxInterface } from '../../interface/checkbox.interface';

@Component({
    selector: 'app-scheda-contatto',
    templateUrl: './scheda-contatto.component.html',
    styleUrls: ['./scheda-contatto.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedaContattoComponent implements OnChanges {

    @Input() scheda: SchedaContatto;
    @Input() idSchedaContattoHover: string;
    @Input() idSchedaContattoSelezionata: string;
    @Input() editSchedaContatto: boolean;
    @Input() schedeContattoSelezionate: string[];
    @Input() classificazione: ClassificazioneSchedaContatto;
    @Input() idVisualizzati: string[];
    @Input() idCollapsed: string[];
    @Input() disableCreaRichiesta: boolean;
    @Input() disableGestisci: boolean;
    @Input() disableRaggruppamento: boolean;
    @Input() disableEliminaRaggruppamento: boolean;
    @Input() nightMode: boolean;

    @Output() hoverIn: EventEmitter<string> = new EventEmitter<string>();
    @Output() hoverOut: EventEmitter<any> = new EventEmitter<any>();
    @Output() selezionata: EventEmitter<string> = new EventEmitter<string>();
    @Output() deselezionata: EventEmitter<string> = new EventEmitter<string>();
    @Output() dettaglioScheda: EventEmitter<string> = new EventEmitter<string>();
    @Output() setSchedaContattoTelefonata: EventEmitter<SchedaContatto> = new EventEmitter<SchedaContatto>();
    @Output() setSchedaContattoGestita: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() editSelezionata: EventEmitter<CheckboxInterface> = new EventEmitter<CheckboxInterface>();
    @Output() checkBoxError: EventEmitter<any> = new EventEmitter<any>();
    @Output() collapsed: EventEmitter<string> = new EventEmitter<string>();
    @Output() undoRaggruppamento: EventEmitter<string> = new EventEmitter<string>();

    btnLetta = { type: '', tooltip: '' };
    btnGestita = { type: '', tooltip: '' };

    classificazioneSchedaContatto = ClassificazioneSchedaContatto;
    priorita = Priorita;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.scheda && changes.scheda.currentValue) {
            if (changes.scheda.currentValue.letta) {
                this.btnLetta = { type: 'btn-outline-primary', tooltip: 'Segna come "Non Letta"' };
            } else {
                this.btnLetta = { type: 'btn-primary', tooltip: 'Segna come "Letta"' };
            }
            if (changes.scheda.currentValue.gestita) {
                this.btnGestita = { type: 'btn-outline-warning btn-gestita', tooltip: 'Segna come "Non Gestita"' };
            } else {
                this.btnGestita = { type: 'btn-warning text-white', tooltip: 'Segna come "Gestita"' };
            }
        }
    }

    cardClasses(id: string): string {
        let cardClasses = '';
        if (this.idSchedaContattoHover === id) {
            cardClasses = ' bg-scheda-contatto';
        }
        switch (this.scheda.classificazione) {
            case ClassificazioneSchedaContatto.Competenza:
                cardClasses += ' status_chiamata';
                break;
            case ClassificazioneSchedaContatto.Conoscenza:
                cardClasses += ' status_assegnato';
                break;
            case ClassificazioneSchedaContatto.Differibile:
                cardClasses += ' status_chiuso';
                break;
        }

        if (this.scheda.gestita) {
            cardClasses += ' gestita';
        }

        if (this.scheda.codiceScheda === this.idSchedaContattoSelezionata) {
            cardClasses += ' selezionata';
        }

        return cardClasses;
    }

    isVisible(): boolean {
        return this.idVisualizzati?.length ? this.idVisualizzati.includes(this.scheda.codiceScheda) : true;
    }

    reducerSelezione(codiceScheda: string): void {
        if (!this.idSchedaContattoSelezionata || this.idSchedaContattoSelezionata !== codiceScheda) {
            this.selezionata.emit(this.scheda.codiceScheda);
        } else {
            this.deselezionata.emit();
        }
    }

    onDettaglioScheda(codiceScheda: string): void {
        this.dettaglioScheda.emit(codiceScheda);
    }

    getCheckboxState(scheda: SchedaContatto): CheckboxInterface {
        let checkBox: CheckboxInterface;
        if (this.disableRaggruppamento) {
            checkBox = { id: scheda.codiceScheda, status: this.schedeContattoSelezionate.includes(scheda.codiceScheda), disabled: true };
        } else {
            checkBox = { id: scheda.codiceScheda, status: this.schedeContattoSelezionate.includes(scheda.codiceScheda), disabled: this.checkDisabled() };
        }
        return checkBox;
    }

    checkDisabled(): boolean {
        if (this.disableRaggruppamento) {
            return false;
        }

        if (this.scheda) {
            if (!this.classificazione) {
                return false;
            } else {
                return this.classificazione !== this.scheda.classificazione;
            }
        }
    }

    checkMessage(): string {
        if (this.schedeContattoSelezionate.length > 0) {
            return this.checkDisabled() ? 'Non selezionabile' : 'Selezionabile';
        }
    }

    onCheckBoxClick(): void {
        if (this.checkDisabled()) {
            this.checkBoxError.emit();
        }
    }

    onEditSchedaSelezionata($event: CheckboxInterface): void {
        console.log('click checkbox', $event);
        $event.object = this.scheda;
        this.editSelezionata.emit($event);
    }

    onCollapse(): void {
        this.collapsed.emit(this.scheda.codiceScheda);
    }

    onUndoRaggruppamento(codiceScheda: string): void {
        this.undoRaggruppamento.emit(codiceScheda);
    }
}
