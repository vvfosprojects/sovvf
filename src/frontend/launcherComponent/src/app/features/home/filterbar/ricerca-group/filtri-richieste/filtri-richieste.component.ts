import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-filtri-richieste',
    templateUrl: './filtri-richieste.component.html',
    styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() categorie: string[];

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    categoriaSelezionata = 'Presidiato';
    filtersSearch = { descrizione: '' };
    p: number;

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

    eliminaFiltriAttivi() {
        this.filtriReset.emit();
    }
}
