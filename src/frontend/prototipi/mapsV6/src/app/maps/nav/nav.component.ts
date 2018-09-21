import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MarkedService} from '../service/marked-service/marked-service.service';
import {Subscription} from 'rxjs';
import {MapsService} from '../service/maps-service/maps-service.service';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {Coordinate} from '../../shared/model/coordinate.model';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    @Output() pulsanteCentroMappa: EventEmitter<any> = new EventEmitter();

    constructor(private mapsService: MapsService, private markedService: MarkedService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    addRandomMarker() {
        this.mapsService.setRandomMarker();
    }

    removeLastMarker() {
        this.mapsService.removeLastMarker();
    }

    changeMarkerColor() {
        this.mapsService.changeMarkerColor();
    }

    changeMarkerSize() {
        this.mapsService.changeMarkerSize();
    }

    changeMarkerAnimation() {
        this.mapsService.changeMarkerAnimation();
    }

    removeMarker() {
        this.mapsService.removeMarker();
    }

    cambiaCentroMappa() {
        // const newCentroMappa = new CentroMappa(new Coordinate(45.283828, 9.105340), 15);
        this.pulsanteCentroMappa.emit();
        // this.mapsService.setCentroMappa();
    }

}

