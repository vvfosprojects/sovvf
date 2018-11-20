import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Sede} from '../../model/sede.model';

@Component({
    selector: 'app-competenza',
    templateUrl: './competenza.component.html',
    styleUrls: ['./competenza.component.scss']
})
export class CompetenzaComponent implements OnInit {
    @Input() competenza: Sede;
    @Input() i: number;
    @Output() LocalizzazioneCompetenza: EventEmitter<Sede> = new EventEmitter(); // (1)

    constructor() {
    }

    ngOnInit() {
    }

    localizzazioneCompetenza(competenza): void {
        console.log('Sono il componente. Voglio localizzare la competenza', competenza);
        this.LocalizzazioneCompetenza.emit(competenza.coordinate);
    }
}
