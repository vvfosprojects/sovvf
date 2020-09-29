import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventoRichiesta } from '../../../../shared/model/evento-richiesta.model';
import * as moment from 'moment';

@Component({
    selector: 'app-lista-eventi-richiesta',
    templateUrl: './lista-eventi-richiesta.component.html',
    styleUrls: ['./lista-eventi-richiesta.component.css']
})
export class ListaEventiRichiestaComponent implements OnInit {

    @Input() loading: boolean;
    @Input() elencoEventi: EventoRichiesta[];
    @Output() targheSelezionate = new EventEmitter<string[]>();

    @Input() iconeNomeClasseEvento: boolean;
    istanteEventoPrecedente: Date; // erano private implementare setter and getter

    constructor() {
    }

    ngOnInit() {
    }

    private setIstanteEventoPrecedente(i: number): Date {
        if (i > 0) {
            this.istanteEventoPrecedente = this.elencoEventi[i - 1].istanteEvento;
        } else {
            this.istanteEventoPrecedente = this.elencoEventi[0].istanteEvento;
        }
        return this.istanteEventoPrecedente;
    }

    setRicercaTargaMezzo(targa: string) {
        if (targa) {
            this.targheSelezionate.emit([targa]);
        }
    }
}
