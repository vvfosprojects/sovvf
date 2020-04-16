import { Component, Input, Output, EventEmitter, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-filtri-richieste',
    templateUrl: './filtri-richieste.component.html',
    styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent implements OnChanges {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() categorie: string[];
    @Input() disableFilters: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    categoriaSelezionata: string;
    filtersSearch = { descrizione: '' };
    p: number;

    constructor(private modalService: NgbModal,
                dropdownOpts: NgbDropdownConfig) {
        dropdownOpts.placement = 'bottom-left';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.categorie && changes.categorie.currentValue) {
            this.categoriaSelezionata = changes.categorie.currentValue[0];
        }
    }

    onSelezioneCategoria(categoria: any) {
        this.categoriaSelezionata = categoria;
    }

    openFiltersModal(content: any) {
        this.filtersSearch = { descrizione: '' };
        this.modalService.open(content, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
    }

    onSelezioneFiltro(filtro: VoceFiltro) {
        this.filtroSelezionato.emit(filtro);
    }

    onDeselezioneFiltro(filtro: VoceFiltro) {
        this.filtroDeselezionato.emit(filtro);
    }

    resetFiltri() {
        this.filtriReset.emit();
    }
}
