import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltroComponent {

    @Input() filtro: VoceFiltro;
    @Input() selezionato: boolean;
    @Input() useCheckbox: boolean;
    @Input() disabled: boolean;
    @Input() disableFiltri: boolean;
    @Input() onlyOneCheck: boolean;
    @Input() listaZoneEmergenzaSelezionate: string[];
    @Input() periodoChiuseChiamate: any;
    @Input() periodoChiusiInterventi: any;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() chiusiModal: EventEmitter<any> = new EventEmitter();
    @Output() zonaEmergenzaModal: EventEmitter<boolean> = new EventEmitter();

    constructor() {
    }

    onSelezione(filtro: VoceFiltro): void {
        if (!this.selezionato) {
            if ((!this.disabled && !this.disableFiltri) || this.filtro.categoria === 'Chiuse') {
                this.zonaEmergenzaModal.emit(true);
                this.filtroSelezionato.emit(filtro);
            }
        } else {
            if ((!this.disabled && !this.disableFiltri) || this.filtro.categoria === 'Chiuse') {
                this.filtroDeselezionato.emit(filtro);
            }
        }
    }

}
