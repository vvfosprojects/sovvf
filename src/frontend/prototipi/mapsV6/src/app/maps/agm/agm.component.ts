import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Meteo} from '../../shared/model/meteo.model';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {MarkerService} from '../service/marker-service/marker-service.service';
import {Coordinate} from '../../shared/model/coordinate.model';

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() centroMappa: CentroMappa;
    datiMeteo: Meteo;
    map_loaded = false;

    constructor(private markerService: MarkerService) {
    }

    ngOnInit() {
    }

    mappaCaricata() {
        /**
         *  imposto una proprietà a true quando la mappa è caricata
         */
        this.map_loaded = true;
    }

    selezioneMarker(marker: RichiestaMarker) {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.markerService.selezionato(marker);
        /**
         *  prendo i dati del meteo dal service marker (che li ha già richiesti)
         */
        this.datiMeteo = this.markerService.datiMeteo;
    }

    tipoIcona(marker: RichiestaMarker) {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi l'url dell'icona da utilizzare
         */
        return this.markerService.tipoIcona(marker);
    }

    trueMarker(marker: RichiestaMarker) {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker cliccato è quello selezionato
         */
        return this.markerService.trueMarker(marker);
    }

    tipoAnimazione(marker: RichiestaMarker) {
        /**
         * metodo non ancora implementato che modifica lo stato dell'icona facendolo rimbalzare o cadere
         */
        return null;
    }

    ricentraMappa(nuovoCentro: CentroMappa) {
        /**
         * metodo che riceve il nuovo centroMappa
         */
        this.centroMappa.zoom = nuovoCentro.zoom;
        this.cambiaCoordinate(nuovoCentro.coordinate);
    }

    cambiaCoordinate(coordinate: Coordinate) {
        /**
         * metodo che ricentra la mappa e si aspetta le coordinate
         */
        this.centroMappa.coordinate.latitudine = coordinate.latitudine;
        this.centroMappa.coordinate.longitudine = coordinate.longitudine;
    }

}
