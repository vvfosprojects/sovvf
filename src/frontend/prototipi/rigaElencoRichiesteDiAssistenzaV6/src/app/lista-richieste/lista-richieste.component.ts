import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SintesiRichiesta} from '../model/sintesi-richiesta.model';
import { SintesiRichiesteService } from '../sintesi-richieste-service/sintesi-richieste.service';
import {MapsService} from '../maps-service/maps-service.service';
import { Marker } from '../model/marker.model';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
    @Output() showDettagli: EventEmitter<SintesiRichiesta> = new EventEmitter();
    @Output() inviaIndirizzo = new EventEmitter();

    richieste: SintesiRichiesta[];
    richiesteFiltrate: SintesiRichiesta[];
    filtriAttivi = 0;

    markers: Marker[] = [
        {
            lat: 51.673858,
            lng: 7.815982,
            label: 'A',
            draggable: true
        },
        {
            lat: 51.373858,
            lng: 7.215982,
            label: 'B',
            draggable: false
        },
        {
            lat: 51.723858,
            lng: 7.895982,
            label: 'C',
            draggable: true
        }
    ]

    constructor(private sintesiRichiesteService: SintesiRichiesteService, private mapsService: MapsService) {
    }

    ngOnInit() {
        this.sintesiRichiesteService.getSintesiRichieste().subscribe(r => {
            this.richieste = r;
            this.richiesteFiltrate = r;
        });

        this.mapsService.markers = this.markers;
    }

    getRichiesteFiltrate(event) {
        this.richiesteFiltrate = event;
    }

    getFiltriAttivi(event) {
        this.filtriAttivi = event;
    }

    showDettagliRicevuto(richiesta: SintesiRichiesta): void {
        console.log('Sono la lista. Vogliono vedere il dettaglio di ', richiesta.id);
        this.showDettagli.emit(richiesta);
    }

    parametriMappa(obj) {
        // console.log(obj);
        this.inviaIndirizzo.emit(obj);
    }
}
