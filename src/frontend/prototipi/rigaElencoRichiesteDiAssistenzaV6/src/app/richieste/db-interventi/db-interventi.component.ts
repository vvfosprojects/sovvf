import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';

@Component({
    selector: 'app-db-interventi',
    templateUrl: './db-interventi.component.html',
    styleUrls: ['./db-interventi.component.css']
})
export class DbInterventiComponent implements OnInit {
    richieste: SintesiRichiesta[];

    constructor(private sintesiRichiesteService: SintesiRichiesteService) {
    }

    ngOnInit() {
        this.getRichieste();
    }

    getRichieste() {
        this.sintesiRichiesteService.getSintesiRichieste().subscribe((r: SintesiRichiesta[]) => {
            this.richieste = r;
        });
    }

    addRichiesta() {
        this.sintesiRichiesteService.addRichiesta();
    }
}
