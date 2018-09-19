import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from './lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit {
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
