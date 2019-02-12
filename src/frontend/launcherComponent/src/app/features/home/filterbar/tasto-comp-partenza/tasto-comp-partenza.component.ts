import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Composizione } from '../../../../shared/enum/composizione.enum';

@Component({
    selector: 'app-tasto-comp-partenza',
    templateUrl: './tasto-comp-partenza.component.html',
    styleUrls: ['./tasto-comp-partenza.component.css']
})
export class TastoCompPartenzaComponent {

    @Input() compPartenzaMode: string;
    @Output() cambioModalita = new EventEmitter();
    Composizione = Composizione;

    changeMode() {
        switch (this.compPartenzaMode) {
            case Composizione.Veloce:
                this.compPartenzaMode = Composizione.Avanzata;
                break;
            case Composizione.Avanzata:
                this.compPartenzaMode = Composizione.Veloce;
                break;
        }
        this.cambioModalita.emit(this.compPartenzaMode);
    }

}
