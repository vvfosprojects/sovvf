import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapsFiltroService } from '../../maps/maps-ui/filtro/maps-filtro.service';
import { Select, Store } from '@ngxs/store';
import { MarkerMeteoState } from './store';
import { Observable } from 'rxjs';
import { SetMarkerMeteo } from './store/actions/marker-meteo-switch.actions';

@Component({
    selector: 'app-marker-meteo-switch',
    templateUrl: './marker-meteo-switch.component.html',
    styleUrls: ['./marker-meteo-switch.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MarkerMeteoSwitchComponent implements OnInit {
    @Select(MarkerMeteoState.active) stateSwitch$: Observable<boolean>;
    stateSwitch: boolean;

    constructor(private store: Store) {
    }

    ngOnInit() {
        this.getSwitchState();
    }

    getSwitchState() {
        this.stateSwitch$.subscribe((state: boolean) => {
            this.stateSwitch = state;
        });
    }

    onChange(active: boolean) {
        this.store.dispatch(new SetMarkerMeteo(active));
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
