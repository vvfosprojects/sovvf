import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-filtro',
    templateUrl: './filtro.component.html',
    styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
    @Input() filtro: VoceFiltro;
    @Input() selezionato: boolean;
    @Input() useCheckbox: boolean;
    @Input() disabled: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    onSelezione(filtro: VoceFiltro) {
        if (!this.selezionato) {
            if (!this.disabled) {
                this.filtroSelezionato.emit(filtro);
            }
        } else {
            if (!this.disabled) {
                this.filtroDeselezionato.emit(filtro);
            }
        }
    }

}
