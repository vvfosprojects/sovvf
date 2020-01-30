import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';
import { ClassificazioneSchedaContatto } from '../../../../shared/enum/classificazione-scheda-contatto.enum';
import { Priorita } from '../../../../shared/model/sintesi-richiesta.model';
import { CheckboxInterface } from '../../../../shared/interface/checkbox.interface';

@Component({
    selector: 'app-scheda-contatto',
    templateUrl: './scheda-contatto.component.html',
    styleUrls: [ './scheda-contatto.component.css' ]
})
export class SchedaContattoComponent implements OnChanges {

    @Input() scheda: SchedaContatto;
    @Input() idSchedaContattoHover: string;
    @Input() editSchedaContatto: boolean;
    @Input() schedeContattoSelezionate: string[];
    @Input() classificazione: ClassificazioneSchedaContatto;
    @Input() idVisualizzati: string[];
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter();
    @Output() dettaglioScheda = new EventEmitter<SchedaContatto>();
    @Output() setSchedaContattoTelefonata = new EventEmitter<SchedaContatto>();
    @Output() setSchedaContattoGestita = new EventEmitter<boolean>();
    @Output() editSelezionata = new EventEmitter<CheckboxInterface>();
    @Output() checkBoxError = new EventEmitter();

    btnLetta = { type: '', tooltip: '' };
    btnGestita = { type: '', tooltip: '' };

    classificazioneSchedaContatto = ClassificazioneSchedaContatto;
    priorita = Priorita;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.scheda && changes.scheda.currentValue) {
            if (changes.scheda.currentValue.letta) {
                this.btnLetta = { type: 'btn-outline-primary', tooltip: 'Segna come "Non Letta"' };
            } else {
                this.btnLetta = { type: 'btn-primary', tooltip: 'Segna come "Letta"' };
            }
            if (changes.scheda.currentValue.gestita) {
                this.btnGestita = { type: 'btn-outline-warning', tooltip: 'Segna come "Non Gestita"' };
            } else {
                this.btnGestita = { type: 'btn-warning', tooltip: 'Segna come "Gestita"' };
            }
        }
    }

    cardClasses(id: string) {
        let _returnClass = '';
        if (this.idSchedaContattoHover === id && !this.scheda.gestita) {
            _returnClass = ' bg-light';
        }
        switch (this.scheda.classificazione) {
            case ClassificazioneSchedaContatto.Competenza:
                _returnClass += ' status_chiamata';
                break;
            case ClassificazioneSchedaContatto.Conoscenza:
                _returnClass += ' status_assegnato';
                break;
            case ClassificazioneSchedaContatto.Differibile:
                _returnClass += ' status_chiuso';
                break;
        }

        if (this.scheda.gestita) {
            _returnClass += ' gestita';
        }

        return _returnClass;
    }

    checkDisabled() {
        if (this.scheda) {
            if (!this.classificazione) {
                return false;
            } else {
                return this.classificazione !== this.scheda.classificazione;
            }
        }
    }

    checkMessage() {
        if (this.schedeContattoSelezionate.length > 0) {
            return this.checkDisabled() ? 'Non selezionabile' : 'Selezionabile';
        }
    }

    onCheckBoxClick() {
        if (this.checkDisabled()) {
            this.checkBoxError.emit();
        }
    }

    onEditSchedaSelezionata($event: CheckboxInterface) {
        console.log('click checkbox', $event);
        $event.object = this.scheda;
        this.editSelezionata.emit($event);
    }
}
