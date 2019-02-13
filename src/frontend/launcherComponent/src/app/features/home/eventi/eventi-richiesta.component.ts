import {Component, OnInit} from '@angular/core';
import {EventoRichiesta} from './eventi-model/evento-richiesta.model';
import { EventiRichiestaService } from '../../../core/service/eventi-richiesta-service/eventi-richiesta.service';

@Component({
    selector: 'app-eventi-richiesta',
    templateUrl: './eventi-richiesta.component.html',
    styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent implements OnInit {

    elencoEventiRichiesta: EventoRichiesta[] = [];

    constructor(private eventiRichiestaService: EventiRichiestaService) {

    }

    ngOnInit() {
        this.getEventi();
    }

    getEventi() {
        this.eventiRichiestaService.getEventiRichiesta()
            .subscribe(eventiRichieste => {
                this.elencoEventiRichiesta = eventiRichieste;
            });
    }
}
