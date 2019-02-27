import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Composizione } from '../../../../shared/enum/composizione.enum';

@Component({
    selector: 'app-tasto-comp-partenza',
    templateUrl: './tasto-comp-partenza.component.html',
    styleUrls: ['./tasto-comp-partenza.component.css']
})
export class TastoCompPartenzaComponent {

    @Input() compPartenzaMode: Composizione;
    @Output() cambioModalita = new EventEmitter<Composizione>();
    Composizione = Composizione;

    changeMode() {

        if (this.compPartenzaMode === Composizione.Avanzata) {
            this.cambioModalita.emit(Composizione.Veloce);
        } else {
            this.cambioModalita.emit(Composizione.Avanzata);
        }

    }

}
