import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { EventoRichiesta } from '../../../../shared/model/evento-richiesta.model';

@Component({
    selector: 'app-add-evento-richiesta',
    templateUrl: './add-evento-richiesta.component.html',
    styleUrls: ['./add-evento-richiesta.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEventoRichiestaComponent {

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
