import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';
import { SintesiRichiesteService } from './lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
    @Output() showDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();
    @Output() inviaIndirizzo = new EventEmitter();

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

    pageChanged(page) {
        console.log(page);
    }
}
