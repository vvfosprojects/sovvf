import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    @Output() randomMarker = new EventEmitter();
    @Output() removeLastMarker = new EventEmitter();
    @Output() changeColorToMarker = new EventEmitter();
    @Output() changeSizeToMarker = new EventEmitter();
    @Output() animationToMarker = new EventEmitter();
    @Input() markerSelezionato: RichiestaMarker;

    constructor() {
    }

    ngOnInit() {
    }

    addRandomMarker() {
        this.randomMarker.emit();
    }

    removeMarker() {
        this.removeLastMarker.emit();
    }

    changeMarkerColor(marker) {
        this.changeColorToMarker.emit(marker);
    }

    changeMarkerSize(marker) {
        this.changeSizeToMarker.emit(marker);
    }

    changeMarkerAnimation(marker) {
        this.animationToMarker.emit(marker);
    }
}
