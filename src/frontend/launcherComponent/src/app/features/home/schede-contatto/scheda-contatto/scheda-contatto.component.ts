import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';
import { ClassificazioneSchedaContatto } from '../../../../shared/enum/classificazione-scheda-contatto.enum';
import { Priorita } from '../../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-scheda-contatto',
    templateUrl: './scheda-contatto.component.html',
    styleUrls: ['./scheda-contatto.component.css']
})
export class SchedaContattoComponent implements OnChanges {

    @Input() scheda: SchedaContatto;
    @Input() idSchedaContattoHover: string;
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter();
    @Output() dettaglioScheda = new EventEmitter<SchedaContatto>();
    @Output() setSchedaContattoTelefonata = new EventEmitter<SchedaContatto>();
    @Output() setSchedaContattoLetta = new EventEmitter<boolean>();
    @Output() setSchedaContattoGestita = new EventEmitter<boolean>();

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
            _returnClass = 'bg-light';
        }
        if (!this.scheda.letta) {
            switch (this.scheda.classificazione) {
                case ClassificazioneSchedaContatto.Competenza:
                    _returnClass += ' status_chiamata non_letta_danger font-weight-bold';
                    break;
                case ClassificazioneSchedaContatto.Conoscenza:
                    _returnClass += ' status_assegnato non_letta_warning font-weight-bold';
                    break;
                case ClassificazioneSchedaContatto.Differibile:
                    _returnClass += ' status_chiuso non_letta_secondary font-weight-bold';
                    break;
            }
        } else {
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
        }

        if (this.scheda.gestita) {
            _returnClass += ' gestita';
        }

        return _returnClass;
    }

    getPrioritaIconClass() {
        return this.scheda.priorita === Priorita.Altissima ? 'fa fa-exclamation-triangle text-danger' : 'fa fa-exclamation-circle text-muted';
    }

    getClassificazioneEventoMaxLength(): number {
        return 17;
    }
}
