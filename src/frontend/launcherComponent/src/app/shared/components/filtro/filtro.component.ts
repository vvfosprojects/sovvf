import { Component, Output, EventEmitter, Input } from '@angular/core';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css']
})
export class FiltroComponent {

    @Input() filtro: VoceFiltro;
    @Input() selezionato: boolean;
    @Input() useCheckbox: boolean;
    @Input() disabled: boolean;
    @Input() onlyOneCheck: boolean;
    @Input() listaZoneEmergenzaSelezionate: string[];
    @Input() periodoChiuse: any;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() chiusiModal: EventEmitter<boolean> = new EventEmitter();
    @Output() zonaEmergenzaModal: EventEmitter<boolean> = new EventEmitter();

    constructor() {
    }

    onSelezione(filtro: VoceFiltro): void {
      if (!this.selezionato) {
            if (!this.disabled) {
                this.zonaEmergenzaModal.emit(true);
                this.filtroSelezionato.emit(filtro);
            }
        } else {
            if (!this.disabled) {
                this.filtroDeselezionato.emit(filtro);
            }
        }
    }

}
