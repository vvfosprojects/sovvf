import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-filtri-richieste',
    templateUrl: './filtri-richieste.component.html',
    styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent {
    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() categorie: string[];

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    categoriaSelezionata = 'Presidiato';
    filtersSearch = { descrizione: '' };

    constructor(private modalService: NgbModal,
                dropdownOpts: NgbDropdownConfig) {
        dropdownOpts.placement = 'bottom-left';
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

    eliminaFiltriAttivi() {
        this.filtriReset.emit();
    }
}
