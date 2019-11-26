import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';
import { ClassificazioneSchedaContatto } from '../../../../shared/enum/classificazione-scheda-contatto.enum';

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

  cardClasses(id: string) {
    let _returnClass = '';
    if (this.idSchedaContattoHover === id) {
      _returnClass = 'bg-light';
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

    return _returnClass;
  }

}
