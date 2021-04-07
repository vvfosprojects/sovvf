import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Sede } from '../../model/sede.model';

@Component({
    selector: 'app-competenza',
    templateUrl: './competenza.component.html',
    styleUrls: ['./competenza.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetenzaComponent {

    @Input() competenza: Sede;
    @Input() i: number;
    @Input() compAvanzata: boolean;

    @Output() LocalizzazioneCompetenza: EventEmitter<Sede> = new EventEmitter(); // (1)

    constructor() {
    }

    localizzazioneCompetenza(competenza): void {
        // console.log('Sono il componente. Voglio localizzare la competenza', competenza);
        this.LocalizzazioneCompetenza.emit(competenza.coordinate);
    }
}
