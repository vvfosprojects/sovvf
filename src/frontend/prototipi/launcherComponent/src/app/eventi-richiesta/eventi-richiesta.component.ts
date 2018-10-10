import {Component, OnInit} from '@angular/core';
import {EventoRichiesta} from './evento-richiesta/evento-richiesta.model';
import {EventiRichiestaService} from './eventi-richiesta-service/eventi-richiesta.service';

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
                console.log('eventiRichiestaService: ', eventiRichieste);
                this.elencoEventiRichiesta = eventiRichieste;
            });
    }
}
