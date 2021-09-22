import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { VoceFiltro } from '../../home/filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-filtri-area-documentale',
    templateUrl: './filtri-area-documentale.component.html',
    styleUrls: ['./filtri-area-documentale.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltriAreaDocumentaleComponent {

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() disableFilters: boolean;
    @Input() nightMode: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

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
