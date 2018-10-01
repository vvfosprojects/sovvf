import {Component, OnInit, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {SedeMarker} from '../maps-model/sede-marker.model';
import {MezzoMarker} from '../maps-model/mezzo-marker.model';
import {Meteo} from '../../shared/model/meteo.model';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {MarkerService} from '../service/marker-service/marker-service.service';
import {Coordinate} from '../../shared/model/coordinate.model';
import {Subject, Subscription} from 'rxjs';
import {CenterService} from '../service/center-service/center-service.service';
import {debounceTime} from 'rxjs/operators';

declare var google: any;

@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnInit {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() mezziMarkers: MezzoMarker[];
    @Input() centroMappa: CentroMappa;
    minMarkerCluster: number;
    datiMeteo: Meteo;
    map_loaded = false;
    map: any;
    subscription: Subscription;
    centro$ = new Subject();

    constructor(private markerService: MarkerService, private centerService: CenterService) {
        this.subscription = this.centerService.getCentro().subscribe(centro => {
            this.centroMappa = centro;
        });
        this.centro$.pipe(
            debounceTime(500)).subscribe(
            coordinate => this.centerService.sendCentro(
                new CentroMappa(
                    new Coordinate(coordinate['lat'], coordinate['lng']),
                    this.map.getZoom()))
        );
        this.minMarkerCluster = 10;
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
         * importo il wrapper nell'oggetto map
         */
        this.map = map;
    }

    selezioneMarker(marker: any): void {
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
        this.centraMappa(new Coordinate(marker.localita.coordinate.latitudine, marker.localita.coordinate.longitudine));
        this.cambiaZoom(12);
    }

    urlIcona(marker: any, modello): string {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi l'url dell'icona da utilizzare
         */
        return this.markerService.tipoIcona(marker, modello);
    }

    trueMarker(marker: any): boolean {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker cliccato è quello selezionato
         */
        return this.markerService.trueMarker(marker);
    }

    tipoAnimazione(marker: any) {
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
                        this.map.setZoom(zoom);
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


    centroCambiato(centro) {
        /**
         * metodo che fa la next sulla subject di centro
         */
        this.centro$.next(centro);
    }

}
