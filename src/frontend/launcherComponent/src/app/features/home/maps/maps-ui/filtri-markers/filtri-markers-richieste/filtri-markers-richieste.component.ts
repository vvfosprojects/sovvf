import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FiltroRichieste } from '../../../maps-model/filtro-richieste.interface';
import { Priorita } from '../../../../../../shared/model/sintesi-richiesta.model';
import { StatoRichiesta } from '../../../../../../shared/enum/stato-richiesta.enum';

@Component({
    selector: 'app-filtri-markers-richieste',
    templateUrl: './filtri-markers-richieste.component.html',
    styleUrls: ['./filtri-markers-richieste.component.css']
})
export class FiltriMarkersRichiesteComponent implements OnInit {
    @Input() filtroRichieste: FiltroRichieste;

    @Output() changePriorita = new EventEmitter<Priorita>();
    @Output() changeStati = new EventEmitter<StatoRichiesta[]>();

    statiRichiesta = Object.keys(StatoRichiesta);

    statiSelezionati: string[] = [];

    ngOnInit(): void {
        this.statiSelezionati = this.filtroRichieste.stato;
    }

    onClearPriorita() {
        this.changePriorita.emit(null);
    }

    onChangeStati($event) {
        console.log($event);
        this.changeStati.emit($event);
    }

}
