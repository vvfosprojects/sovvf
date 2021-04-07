import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { CategoriaFiltriSchedeContatto as Categoria } from 'src/app/shared/enum/categoria-filtri-schede-contatto';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-filtri-schede-contatto',
    templateUrl: './filtri-schede-contatto.component.html',
    styleUrls: ['./filtri-schede-contatto.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltriSchedeContattoComponent {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() disableFilters: boolean;
    @Input() nightMode: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    Categoria = Categoria;

    constructor(private dropdownConfig: NgbDropdownConfig) {
        dropdownConfig.placement = 'bottom-right';
    }

    onSelezioneFiltro(filtro: VoceFiltro): void {
        console.log('filtriSelezionati', this.filtriSelezionati);
        this.filtriSelezionati.forEach((f: VoceFiltro) => {
            if (f !== filtro && f.categoria === filtro.categoria) {
                this.filtroSelezionato.emit(f);
            }
        });
        this.filtroSelezionato.emit(filtro);
    }

    eliminaFiltriAttivi(): void {
        this.filtriReset.emit();
    }

    _isSelezionato(filtro: VoceFiltro): boolean {
        return !!this.filtriSelezionati.filter((f: VoceFiltro) => f.codice === filtro.codice).length;
    }
}
