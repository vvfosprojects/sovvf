import {Component, OnInit} from '@angular/core';
import {EventoRichiesta} from './eventi-model/evento-richiesta.model';
import {EventiManagerService} from '../core/manager/eventi-richiesta-manager/eventi-manager-service.service';

@Component({
    selector: 'app-eventi-richiesta',
    templateUrl: './eventi-richiesta.component.html',
    styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent implements OnInit {

    elencoEventiRichiesta: EventoRichiesta[] = [];

    constructor(private eventiRichiestaManager: EventiManagerService) {

    }

    ngOnInit() {
        this.getEventi();
    }

    getEventi() {
        this.eventiRichiestaManager.getEventiRichiesta()
            .subscribe(eventiRichieste => {
                // console.log('eventiRichiestaService: ', eventiRichieste);
                this.elencoEventiRichiesta = eventiRichieste;
            });
    }
}
