import { Component, Input, OnInit } from '@angular/core';
import { Tipologia } from '../../model/tipologia.model';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';

@Component({
    selector: 'app-tipologia-sintesi-richiesta',
    templateUrl: './tipologia-sintesi-richiesta.component.html',
    styleUrls: ['./tipologia-sintesi-richiesta.component.scss']
})
export class TipologiaSintesiRichiestaComponent implements OnInit {

    @Input() tipologieRichiesta: Tipologia[];
    @Input() descrizioneRichiesta: string;
    @Input() triage: boolean;

    methods = new HelperSintesiRichiesta();

    constructor() {
    }

    ngOnInit(): void {
    }

    getPrimaTipologia(): Tipologia {
        if (this.tipologieRichiesta?.length) {
            return this.tipologieRichiesta[0];
        } else {
            return null;
        }
    }

    getDescrizionePrimaTipologia(): string {
        if (this.tipologieRichiesta?.length) {
            return this.tipologieRichiesta[0].descrizione;
        } else {
            return '';
        }
    }
}
