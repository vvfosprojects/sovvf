import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetCentroMappa } from '../../store/actions/maps/centro-mappa.actions';
import { AreaMappa } from '../maps-model/area-mappa-model';
import { SetAreaMappa } from '../../store/actions/maps/area-mappa.actions';
import { MAPSOPTIONS } from '../../../../core/settings/maps-options';
import { LatLngBounds, LatLngLiteral } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { makeAreaMappa, makeCoordinate } from '../../../../shared/helper/function';


@Injectable()
export class AgmService {

    map: GoogleMap;
    private centro$ = new Subject<Coordinate>();
    private area$ = new Subject<AreaMappa>();
    private centro: Coordinate;

    constructor(private store: Store) {
        /**
         * Subject Coordinate Centro Mappa Attuale
         */
        this.getCentro().subscribe(
            coordinate => {
                console.log('Centro mappa aggiornato', coordinate);
                const currentZoom = this.map.getZoom();
                console.log('currentZoom', currentZoom);
                if (currentZoom - 1 > MAPSOPTIONS.minZoom) {
                    // Todo: sblocco richieste mezzi e sedi
                    console.log('filtro marker mezzi e sedi Sbloccato');
                } else {
                    // Todo: blocco richieste mezzi e sedi
                    console.log('filtro marker mezzi e sedi Bloccato');
                }
                const centroMappa = new CentroMappa(
                    coordinate,
                    currentZoom);
                this.store.dispatch(new SetCentroMappa(centroMappa));
            }
        );
        /**
         * Subject Coordinate Area Mappa Attuale
         */
        this.getArea().subscribe(area => this.store.dispatch(new SetAreaMappa(area)));
    }

    setCentro(coordinate: LatLngLiteral): void {
        const centro: Coordinate = makeCoordinate(coordinate.lat, coordinate.lng, 8);
        if (!this.centro || (this.centro && this.centro.latitudine !== centro.latitudine || this.centro.longitudine !== centro.longitudine)) {
            this.centro$.next(centro);
        }
        this.centro = makeCoordinate(coordinate.lat, coordinate.lng, 8);
    }

    private getCentro(): Observable<Coordinate> {
        return this.centro$.asObservable().pipe(debounceTime(MAPSOPTIONS.panDelay));
    }

    setArea(bounds: LatLngBounds): void {
        this.area$.next(makeAreaMappa(bounds));
    }

    private getArea(): Observable<AreaMappa> {
        return this.area$.asObservable().pipe(debounceTime(MAPSOPTIONS.panMarkerRefresh));
    }

}
