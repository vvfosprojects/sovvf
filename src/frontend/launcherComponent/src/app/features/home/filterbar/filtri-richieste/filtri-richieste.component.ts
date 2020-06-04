import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbActiveModal, NgbDropdownConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalFiltriTipologiaComponent } from './modal-filtri-tipologia/modal-filtri-tipologia.component';
import { ApplyFiltriTipologiaSelezionatiRichieste } from '../../store/actions/filterbar/filtri-richieste.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-filtri-richieste',
    templateUrl: './filtri-richieste.component.html',
    styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() disableFilters: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    constructor(private store: Store,
                private modalService: NgbModal,
                private modal: NgbActiveModal,
                dropdownOpts: NgbDropdownConfig) {
        dropdownOpts.placement = 'bottom';
    }

    openFiltersModal() {
        const modalOptions = { windowClass: 'xlModal', backdrop: 'static', backdropClass: 'light-blue-backdrop', centered: true, keyboard: false } as NgbModalOptions;
        const modal = this.modalService.open(ModalFiltriTipologiaComponent, modalOptions);
        modal.result.then((res: string) => {
            switch (res) {
                case 'ok':
                    this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
                    break;
                case 'ko':
                    break;
            }
        });
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
