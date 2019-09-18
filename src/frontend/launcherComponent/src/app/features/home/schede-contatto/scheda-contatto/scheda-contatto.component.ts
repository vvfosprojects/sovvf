import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';

@Component({
    selector: 'app-scheda-contatto',
    templateUrl: './scheda-contatto.component.html',
    styleUrls: ['./scheda-contatto.component.css']
})
export class SchedaContattoComponent {

    @Input() scheda: SchedaContatto;
    @Input() idSchedaContattoHover: string;
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter();
    @Output() dettaglioScheda = new EventEmitter<SchedaContatto>();
    @Output() setSchedaContattoTelefonata = new EventEmitter<SchedaContatto>();

    cardClasses(idSchedaContatto: string) {
        let _returnClass = '';
        if (this.idSchedaContattoHover === idSchedaContatto) {
            _returnClass = 'bg-light';
        }
        if (this.scheda.perCompetenza) {
            _returnClass += ' status_chiamata';
        } else {
            _returnClass += ' status_assegnato';
        }

        return _returnClass;
    }

}
