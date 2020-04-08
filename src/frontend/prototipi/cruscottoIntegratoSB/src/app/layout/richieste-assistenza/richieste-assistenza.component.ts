import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { SintesiRichiesta } from "../../shared/modules/rich-ass/sintesi-richiesta/sintesi-richiesta.model";
import { SintesiRichiesteService } from "../../shared/modules/rich-ass/sintesi-richieste-service/sintesi-richieste.service";

import { EventoRichiesta } from '../../shared/modules/eventi-rich-ass/evento-richiesta/evento-richiesta.model';
import { EventiRichiestaService } from '../../shared/modules/eventi-rich-ass/eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from '../../shared/modules/eventi-rich-ass/eventi-richiesta-service/eventi-richiesta.service.fake'


@Component({
    selector: 'richieste-assistenza',
    templateUrl: './richieste-assistenza.component.html',
    styleUrls: ['./richieste-assistenza.component.scss'],
    animations: [routerTransition()]
})
export class RichiesteAssistenzaComponent implements OnInit {
    richieste: SintesiRichiesta[] = [];

    elencoEventiRichiesta : EventoRichiesta[] = [];

    constructor(private sintesiRichiesteService: SintesiRichiesteService, private eventiRichiestaService: EventiRichiestaService) {}

    ngOnInit() {
        this.sintesiRichiesteService.getSintesiRichieste()
      .subscribe(richieste => {
        console.log("Richieste service: ", richieste);
        this.richieste = richieste;
      });
      
      this.eventiRichiestaService.getEventiRichiesta()
      .subscribe( eventiRichieste => {
        console.log("eventiRichiestaService: ", eventiRichieste);
        this.elencoEventiRichiesta = eventiRichieste;
      });
    }

    showDettagliRicevuto(richiesta: SintesiRichiesta): void {
        console.log("Sono app.component. Vogliono vedere i dettagli di", richiesta.id);
      }
}
