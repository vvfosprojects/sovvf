import { Coordinate } from '../../model/coordinate.model';
import { CentroMappa } from '../../../features/home/maps/maps-model/centro-mappa.model';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
import { AreaMappa } from '../../../features/home/maps/maps-model/area-mappa-model';
import { LatLngBoundsLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { roundToDecimal } from '../function-generiche';

export function makeCentroMappa(coordinate: Coordinate, zoom: number): CentroMappa {
    return new CentroMappa(coordinate, zoom);
}

export function diffCoordinate(coordinate1: Coordinate, coordinate2: Coordinate): boolean {
    if (coordinate1 && coordinate2) {
        return (coordinate1.latitudine !== coordinate2.latitudine || coordinate1.longitudine !== coordinate2.longitudine);
    }
    return false;
}

export function makeCoordinate(lat: number, long: number, expRound?: number): Coordinate {
    return new Coordinate(roundToDecimal(lat, expRound), roundToDecimal(long, expRound));
}

export function makeAreaMappa(bounds: LatLngBounds, expRound?: number): AreaMappa {
    return new AreaMappa(
        makeCoordinate(bounds.getNorthEast().lat(), bounds.getNorthEast().lng(), expRound),
        makeCoordinate(bounds.getSouthWest().lat(), bounds.getSouthWest().lng(), expRound)
    );
}

export function makeLatLngBounds(areaMappa: AreaMappa): LatLngBoundsLiteral {
    return {
        east: areaMappa.topRight.longitudine,
        north: areaMappa.topRight.latitudine,
        west: areaMappa.bottomLeft.longitudine,
        south: areaMappa.bottomLeft.latitudine
    } as LatLngBoundsLiteral;
}

export function degToCompass(num: number): any {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
}

export function wipeCoordinate(coordinate: Coordinate): any {
    if (coordinate) {
        return 'lat=' + Math.floor(coordinate.latitudine * 100) / 100 + '&lon=' + Math.floor(coordinate.longitudine * 100) / 100;
    } else {
        return console.error('Errore ricezione coordinate: ', coordinate);
    }
}

export function coord2String(value: number): string {
    const numberToString = value.toString();
    const countString = numberToString.length;
    return numberToString.slice(0, ((countString - 5) * -1));
}