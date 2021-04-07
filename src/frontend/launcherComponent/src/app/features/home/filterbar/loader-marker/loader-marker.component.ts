import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-loader-marker',
    templateUrl: './loader-marker.component.html',
    styleUrls: ['./loader-marker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderMarkerComponent {

    @Input() markerOnLoading: boolean;

    constructor() {
    }

}
