import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiltroRichieste } from '../../../maps-model/filtro-richieste.interface';
import { Priorita } from '../../../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from '../../../../../../shared/enum/stato-richiesta.enum';

@Component({
    selector: 'app-filtri-markers-richieste',
    templateUrl: './filtri-markers-richieste.component.html',
    styleUrls: ['./filtri-markers-richieste.component.css']
})
export class FiltriMarkersRichiesteComponent {
    @Input() filtroRichieste: FiltroRichieste;

    @Output() changePriorita: EventEmitter<Priorita> = new EventEmitter<Priorita>();
    @Output() changeStati: EventEmitter<any> = new EventEmitter<any>();

    statiRichiesta = Object.keys(StatoRichiesta);

    onClearPriorita() {
        this.changePriorita.emit(null);
    }

}
