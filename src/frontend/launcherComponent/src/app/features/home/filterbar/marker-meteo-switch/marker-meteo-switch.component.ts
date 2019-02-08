import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-marker-meteo-switch',
    templateUrl: './marker-meteo-switch.component.html',
    styleUrls: ['./marker-meteo-switch.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MarkerMeteoSwitchComponent {
    @Input() stateSwitch: boolean;

    // Events
    @Output() change: EventEmitter<boolean> = new EventEmitter();

    constructor() {
    }

    onChange(active: boolean) {
        this.change.emit(active);
    }

    returnColor(): string {
        let returnClass = '';

        switch (this.stateSwitch) {
            case true:
                returnClass = '#007bff';
                break;
            case false:
                returnClass = '#fff';
                break;
        }
        return returnClass;
    }
}
