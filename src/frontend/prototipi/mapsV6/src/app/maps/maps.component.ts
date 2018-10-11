import {Component, OnInit} from '@angular/core';
import {CentroMappa} from './maps-model/centro-mappa.model';
import {RichiestaMarker} from './maps-model/richiesta-marker.model';
import {Coordinate} from '../shared/model/coordinate.model';
import {MapManagerService} from './service/maps-manager/map-manager-service.service';
import {SedeMarker} from './maps-model/sede-marker.model';
import {MezzoMarker} from './maps-model/mezzo-marker.model';
import {FakerCambioSedeService} from './maps-test/fake-cambio-sede/faker-cambio-sede.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[];
    sediMarkers: SedeMarker[];
    mezziMarkers: MezzoMarker[];

    constructor(private mapManager: MapManagerService /** servizio che innietta dati alla mappa **/,
                public fakeCambioSede: FakerCambioSedeService) {
        /**
         *  creo un oggetto di tipo centroMappa per inizializzare la mappa
         */
        this.centroMappa = new CentroMappa(new Coordinate(42.290251, 12.492373), 8);
        /**
         * imposto true la proprietà preLoader per far visualizzare di default il div che contiene il component maps
         */
    }

    ngOnInit() {
        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo richiestaMarker
         */
        this.mapManager.getRichiesteMarker().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
            /**
             *  inizializzo un contatore nel servizio per tenere traccia del numero di richieste
             */
            this.mapManager.count = this.richiesteMarkers.length;
        });

        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo sedeMarker
         */
        this.mapManager.getSediMarker().subscribe((r: SedeMarker[]) => {
            this.sediMarkers = r;
        });

        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo mezzoMarker
         */
        this.mapManager.getMezziMarker().subscribe((r: MezzoMarker[]) => {
            this.mezziMarkers = r;
        });

    }

}
