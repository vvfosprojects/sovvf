import {Component, OnInit} from '@angular/core';
import {MarkerService} from '../marker-service/marker-service.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    constructor(private markerService: MarkerService) {
    }

    ngOnInit() {
    }

    addRandomMarker() {
        this.markerService.setRandomMarker();
    }

    removeLastMarker() {
        this.markerService.removeLastMarker();
    }

    changeMarkerColor() {
        this.markerService.changeMarkerColor(this.markerService.selectedMarker);
    }

    changeMarkerSize() {
        this.markerService.changeMarkerSize(this.markerService.selectedMarker);
    }

    changeMarkerAnimation() {
        this.markerService.changeMarkerAnimation(this.markerService.selectedMarker);
    }

}

