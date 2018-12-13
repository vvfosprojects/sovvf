import {Component, OnDestroy} from '@angular/core';
import {MarkedService} from '../../maps/service/marked-service/marked-service.service';
import {Subscription} from 'rxjs';
import {FakeMethodService} from '../fake-method/fake-method-service.service';
import {CentroMappa} from '../../maps/maps-model/centro-mappa.model';
import {Coordinate} from '../../shared/model/coordinate.model';
import { DirectionService } from '../../maps/service/direction-service/direction-service.service';
import { DirectionInterface } from '../../maps/service/direction-service/direction-interface';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {

    markerSelezionato: any;
    subscription: Subscription;
    testS: string;


    constructor(private markedService: MarkedService,
                private fakeManager: FakeMethodService,
                private directionService: DirectionService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    addRandomMarker() {
        this.fakeManager.setRandomMarker();
    }

    removeLastMarker() {
        this.fakeManager.removeLastMarker();
    }

    changeMarkerColor() {
        this.fakeManager.changeMarkerColor();
    }

    changeMarkerSize() {
        this.fakeManager.changeMarkerSize();
    }

    changeMarkerAnimation() {
        this.fakeManager.changeMarkerAnimation();
    }

    removeMarker() {
        this.fakeManager.removeMarker();
    }

    centroMilano() {
        const milano = new CentroMappa(new Coordinate(45.283828, 9.105340), 8);
        this.fakeManager.aggiornaCentro(milano);
    }

    centroRoma() {
        const roma = new CentroMappa(new Coordinate(41.5330, 12.3040), 8);
        this.fakeManager.aggiornaCentro(roma);
    }

    nuovoCentro() {
        this.fakeManager.aggiornaCentro();
    }

    calcolaCentro() {
        this.fakeManager.calcolaCentro();
    }

    startDirection() {
        const direzioni: DirectionInterface = {
            origin: {
                lat: 41.8624992,
                lng: 12.5532867
            },
            destinataion: {
                lat: 41.9161894,
                lng: 12.4554147
            },
            isVisible: true
        };
        this.directionService.sendDirection(direzioni);
    }

    stopDirection() {
        this.directionService.clearDirection();
    }

    getMarker(id) {
        this.fakeManager.getMarker(id);
    }

}
