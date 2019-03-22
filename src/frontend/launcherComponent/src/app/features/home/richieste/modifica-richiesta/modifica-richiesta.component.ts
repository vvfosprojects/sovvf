import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-modifica-richiesta',
    templateUrl: './modifica-richiesta.component.html',
    styleUrls: ['./modifica-richiesta.component.css']
})
export class ModificaRichiestaComponent implements OnInit {

    richiesta: SintesiRichiesta;

    constructor() {
    }

    ngOnInit() {
    }

}
