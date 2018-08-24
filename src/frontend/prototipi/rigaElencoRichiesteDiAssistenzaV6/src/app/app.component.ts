import {Component, OnInit} from '@angular/core';

import {SintesiRichiesta} from './model/sintesi-richiesta.model';
import {SintesiRichiesteService} from './sintesi-richieste-service/sintesi-richieste.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    showDettagliRicevuto(richiesta: SintesiRichiesta): void {
        console.log('Sono app.component. Vogliono vedere i dettagli di', richiesta.id);
    }

}
