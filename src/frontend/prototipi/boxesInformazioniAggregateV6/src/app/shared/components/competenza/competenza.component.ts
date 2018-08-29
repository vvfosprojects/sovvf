import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Competenza} from '../../model/competenza.model';

@Component({
    selector: 'app-competenza',
    templateUrl: './competenza.component.html',
    styleUrls: ['./competenza.component.scss']
})
export class CompetenzaComponent implements OnInit {
    @Input() competenza: Competenza;
    @Input() i: number;
    @Output() LocalizzazioneCompetenza: EventEmitter<Competenza> = new EventEmitter(); // (1)

    constructor() {
    }

    ngOnInit() {
    }

    private localizzazioneCompetenza(competenza): void {
        // Tolto in attesa di istruzioni
        // console.log('Sono il componente. Voglio localizzare la competenza', competenza);
        // this.LocalizzazioneCompetenza.emit(competenza.coordinate);
    }
}
