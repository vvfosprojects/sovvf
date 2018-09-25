import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MarkedService} from '../service/marked-service/marked-service.service';
import {Subscription} from 'rxjs';
import {MapsService} from '../service/maps-service/maps-service.service';
import {CentroMappa} from '../maps-model/centro-mappa.model';
import {Coordinate} from '../../shared/model/coordinate.model';
import {MapManagerService} from '../service/maps-manager/map-manager-service.service';
import {FakeMethodService} from '../service/fake-method/fake-method-service.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    @Output() pulsanteCentroMappa: EventEmitter<any> = new EventEmitter();

    constructor(private mapsService: MapsService, private markedService: MarkedService, private mapManager: FakeMethodService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    addRandomMarker() {
        this.mapManager.setRandomMarker();
    }

    removeLastMarker() {
        this.mapManager.removeLastMarker();
    }

    changeMarkerColor() {
        this.mapManager.changeMarkerColor();
    }

    changeMarkerSize() {
        this.mapManager.changeMarkerSize();
    }

    changeMarkerAnimation() {
        this.mapManager.changeMarkerAnimation();
    }

    removeMarker() {
        this.mapManager.removeMarker();
    }

    cambiaCentroMappa() {
        // const newCentroMappa = new CentroMappa(new Coordinate(45.283828, 9.105340), 15);
        this.pulsanteCentroMappa.emit();
        // this.mapsService.setCentroMappa();
    }

}

