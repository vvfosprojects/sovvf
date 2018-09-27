import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Meteo} from '../../shared/model/meteo.model';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {MarkerService} from '../service/marker-service/marker-service.service';
import {Coordinate} from '../../shared/model/coordinate.model';
import {Subscription} from 'rxjs';
import {CenterService} from '../service/center-service/center-service.service';

declare var google: any;

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
    map: any;
    subscription: Subscription;

    constructor(private markerService: MarkerService, private centerService: CenterService) {
        this.subscription = this.centerService.getCentro().subscribe(centro => {
            this.centroMappa = centro;
        });
    }

    ngOnInit() {
    }

    mappaCaricata(): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata
         */
        this.map_loaded = true;
    }

    loadAPIWrapper(map): void {
        /**
         * assegno il wrapper di gmaps a una proprietà
         */
        this.map = map;
    }

    selezioneMarker(marker: RichiestaMarker): void {
        /**
         *  ricevo il marker selezionato dal componente mappa (agm)
         */
        this.markerService.selezionato(marker);
        /**
         *  prendo i dati del meteo dal service marker (che li ha già richiesti)
         */
        this.datiMeteo = this.markerService.datiMeteo;
        /**
         * richiamo i metodi per modficare il centro e lo zoom del marker cliccato
         */
        this.centraMappa(new Coordinate(marker.localita.coordinate[0], marker.localita.coordinate[1]));
        this.cambiaZoom(12);
    }

    tipoIcona(marker: RichiestaMarker): string {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi l'url dell'icona da utilizzare
         */
        return this.markerService.tipoIcona(marker);
    }

    trueMarker(marker: RichiestaMarker): boolean {
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

    cambiaZoom(zoom: number): void {
        /**
         * metodo che cambia lo zoom e si aspetta il number dello zoom,
         * inoltre effettua una transazione tra i vari livelli di zoom creando un effetto animato
         */
        if (!this.map) {
            return;
        }
        const zoomCorrente = this.map.getZoom();
        const livelliZoom = Math.floor((zoom - zoomCorrente) / 2);
        if (zoom - zoomCorrente > 0) {
            if (livelliZoom === 1) {
                this.map.setZoom(zoom);
            } else {
                this.map.setZoom(zoomCorrente + 2);
                setTimeout(() => {
                        this.map.setZoom(zoom );
                    }, 450
                );
            }
        }
    }

    centraMappa(coordinate: Coordinate): void {
        /**
         * metodo che ricentra la mappa e si aspetta le coordinate del nuovo centro
         */
        const posizione = new google.maps.LatLng(coordinate.latitudine, coordinate.longitudine);
        this.map.panTo(posizione);
    }

    centroCambiato(coordinate) {
        // console.log('centro cambiato' + coordinate);
    }

}
