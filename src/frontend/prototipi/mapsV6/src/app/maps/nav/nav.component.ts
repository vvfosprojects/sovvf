import {Component, OnDestroy} from '@angular/core';
import {RichiestaMarker} from '../maps-db-interventi/maps-model/richiesta-marker.model';
import {MarkedService} from '../maps-db-interventi/marked-service/marked-service.service';
import {Subscription} from 'rxjs';
import {MapsService} from '../maps-db-interventi/maps-service/maps-service.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

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

}

