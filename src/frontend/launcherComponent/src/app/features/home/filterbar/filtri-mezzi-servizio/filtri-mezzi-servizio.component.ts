import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { StatoMezzo } from '../../../../shared/enum/stato-mezzo.enum';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-filtri-mezzi-servizio',
    templateUrl: './filtri-mezzi-servizio.component.html',
    styleUrls: ['./filtri-mezzi-servizio.component.css']
})
export class FiltriMezziServizioComponent {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() disableFilters: boolean;
    @Input() nightMode: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    StatoMezzo = StatoMezzo;

    constructor(dropdownOpts: NgbDropdownConfig) {
        dropdownOpts.placement = 'bottom';
    }

    onSelezioneFiltro(filtro: VoceFiltro): void {
        this.filtroSelezionato.emit(filtro);
    }

    resetFiltri(): void {
        this.filtriReset.emit();
    }

    _isSelezionato(filtro: VoceFiltro): boolean {
        return this.filtriSelezionati.filter((f: VoceFiltro) => f.codice === filtro.codice).length > 0;
    }
}
