import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventoRichiesta } from '../../../../shared/model/evento-richiesta.model';

@Component({
    selector: 'app-lista-eventi-richiesta',
    templateUrl: './lista-eventi-richiesta.component.html',
    styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent {

    @Input() loading: boolean;
    @Input() elencoEventi: EventoRichiesta[];
    @Input() iconeNomeClasseEvento: boolean;

    @Output() targheSelezionate = new EventEmitter<string[]>();

    constructor() {
    }

    setRicercaTargaMezzo(targa: string): void {
        if (targa) {
            this.targheSelezionate.emit([targa]);
        }
    }
}
