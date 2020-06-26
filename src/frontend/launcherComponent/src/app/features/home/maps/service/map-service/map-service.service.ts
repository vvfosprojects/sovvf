import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { CentroMappa } from '../../maps-model/centro-mappa.model';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetCentroMappa } from '../../../store/actions/maps/centro-mappa.actions';
import { AreaMappa } from '../../maps-model/area-mappa-model';
import { SetAreaMappa } from '../../../store/actions/maps/area-mappa.actions';
import { MAPSOPTIONS } from '../../../../../core/settings/maps-options';
import { diffCoordinate, makeAreaMappa, makeCoordinate } from '../../../../../shared/helper/function';
import { LatLngBounds } from '@agm/core/services/google-maps-types';

@Injectable()
export class MapService {

    private centro$ = new Subject<CentroMappa>();
    private area$ = new Subject<AreaMappa>();
    private centro: Coordinate;

    private wipeTopRight: Coordinate;

    constructor(private store: Store) {
        /**
         * Subject Coordinate Centro Mappa Attuale
         */
        this.getCentro().subscribe(
            centroMappa => {
                // console.log('Centro mappa aggiornato', centroMappa);
                if (centroMappa.zoom - 1 > MAPSOPTIONS.minZoom) {
                    // console.log('filtro marker mezzi e sedi Sbloccato');
                } else {
                    // console.log('filtro marker mezzi e sedi Bloccato');
                }
                this.store.dispatch(new SetCentroMappa(centroMappa));
            }
        );
        /**
         * Subject Coordinate Area Mappa Attuale
         */
        this.getArea().subscribe(area => this.store.dispatch(new SetAreaMappa(area)));
    }

    setCentro(centroMappa: CentroMappa): void {
        if (!this.centro || (diffCoordinate(this.centro, centroMappa.coordinateCentro))) {
            this.centro$.next(centroMappa);
        }
        this.centro = centroMappa.coordinateCentro;
    }

    private getCentro(): Observable<CentroMappa> {
        return this.centro$.asObservable().pipe(debounceTime(MAPSOPTIONS.panDelay));
    }

    setArea(latLngBounds: LatLngBounds): void {
        const area = makeAreaMappa(latLngBounds);
        if (!this.wipeTopRight || (diffCoordinate(
                makeCoordinate(this.wipeTopRight.latitudine, this.wipeTopRight.longitudine),
                makeCoordinate(area.topRight.latitudine, area.topRight.longitudine))
        )) {
            this.area$.next(area);
        }
        this.wipeTopRight = area.topRight;
    }

    private getArea(): Observable<AreaMappa> {
        return this.area$.asObservable().pipe(debounceTime(MAPSOPTIONS.panMarkerRefresh));
    }

}
