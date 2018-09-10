import {Component, OnDestroy} from '@angular/core';
import {MarkerService} from '../marker-service/marker-service.service';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {MarkedService} from '../marked-service/marked-service.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {

    markerSelezionato: RichiestaMarker;
    subscription: Subscription;

    constructor(private markerService: MarkerService, private markedService: MarkedService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    addRandomMarker() {
        this.markerService.setRandomMarker();
    }

    removeLastMarker() {
        this.markerService.removeLastMarker();
    }

    changeMarkerColor() {
        this.markerService.changeMarkerColor();
    }

    changeMarkerSize() {
        this.markerService.changeMarkerSize();
    }

    changeMarkerAnimation() {
        this.markerService.changeMarkerAnimation();
    }

    removeMarker() {
        this.markerService.removeMarker();
    }

}

