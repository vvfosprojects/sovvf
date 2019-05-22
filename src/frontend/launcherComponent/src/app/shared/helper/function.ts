import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { Coordinate } from '../model/coordinate.model';
import { CentroMappa } from '../../features/home/maps/maps-model/centro-mappa.model';

export function makeCopy(value): any {
    return (JSON.parse(JSON.stringify(value)));
}

export function wipeStatoRichiesta(stato: StatoRichiesta): string {
    const stati: [StatoRichiesta, string][] = [
        [StatoRichiesta.Chiamata, 'chiamate'],
        [StatoRichiesta.Sospesa, 'sospesi'],
        [StatoRichiesta.Assegnata, 'assegnati'],
        [StatoRichiesta.Presidiata, 'presidiati'],
        [StatoRichiesta.Chiusa, 'chiusi']
    ];
    const mapTipoStato: Map<StatoRichiesta, string> = new Map(stati);

    return mapTipoStato.get(stato);
}

export function makeCentroMappa(coordinate: Coordinate, zoom: number): CentroMappa {
    return new CentroMappa(coordinate, zoom);
}

export function makeCoordinate(lat: number, long: number): Coordinate {
    return new Coordinate(lat, long);
}

export function degToCompass(num: number) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
}

export function wipeCoordinate(coordinate: Coordinate) {
    if (coordinate) {
        return 'lat=' + Math.floor(coordinate.latitudine * 100) / 100 + '&lon=' + Math.floor(coordinate.longitudine * 100) / 100;
    } else {
        return console.error('Errore ricezione coordinate meteo: ', coordinate);
    }
}

export function coord2String(number: number) {
    const string = number.toString();
    const countString = string.length;
    return string.slice(0, ((countString - 5) * -1));
}

export function makeID(lengthString?: number): string {
    let text = '';
    const _lengthString = lengthString ? lengthString : 24;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < _lengthString; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function arraysEqual(a1: any[], a2: any[]) {
    return JSON.stringify(a1) === JSON.stringify(a2);
}

export function arrayUnique(arr: any[]) {
    return arr.filter((item, index) => {
        return arr.indexOf(item) >= index;
    });
}

export function arrayDiff(a1, a2) {
    return a1.filter(item => a2.indexOf(item) < 0);
}

export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function objectDiff(current: object, previous: object) {
    const newObj: object = {};
    const previousKeys = Object.keys(previous);
    let hasError = false;
    Object.keys(current).forEach( (key, index) => {
        if (previousKeys[index] === key && !hasError) {
            newObj[key] = current[key] - previous[key];
        } else {
            hasError = true;
        }
    });
    return !hasError ? newObj : null;
}
