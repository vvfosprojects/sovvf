import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { Coordinate } from '../model/coordinate.model';
import { CentroMappa } from '../../features/home/maps/maps-model/centro-mappa.model';
import { StatoMezzo } from '../enum/stato-mezzo.enum';
import { StatoMezzoActions } from '../enum/stato-mezzo-actions.enum';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { StatoRichiestaActions } from '../enum/stato-richiesta-actions.enum';
import { Tipologia } from '../model/tipologia.model';
import { LatLngBounds } from '@agm/core';
import { AreaMappa } from '../../features/home/maps/maps-model/area-mappa-model';
import { Role, Utente } from '../model/utente.model';
import { Sede } from '../model/sede.model';
import { LatLngBoundsLiteral } from 'ngx-google-places-autocomplete/objects/latLng';

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

export function diffCoordinate(coordinate1: Coordinate, coordinate2: Coordinate): boolean {
    if (coordinate1 && coordinate2) {
        return (coordinate1.latitudine !== coordinate2.latitudine || coordinate1.longitudine !== coordinate2.longitudine);
    }
    return false;
}

export function makeCoordinate(lat: number, long: number, expRound?: number): Coordinate {
    return new Coordinate(roundTodecimal(lat, expRound), roundTodecimal(long, expRound));
}

export function makeAreaMappa(bounds: LatLngBounds): AreaMappa {
    return new AreaMappa(
        new Coordinate(bounds.getNorthEast().lat(), bounds.getNorthEast().lng()),
        new Coordinate(bounds.getSouthWest().lat(), bounds.getSouthWest().lng())
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

export function degToCompass(num: number) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
}

export function wipeCoordinate(coordinate: Coordinate) {
    if (coordinate) {
        return 'lat=' + Math.floor(coordinate.latitudine * 100) / 100 + '&lon=' + Math.floor(coordinate.longitudine * 100) / 100;
    } else {
        return console.error('Errore ricezione coordinate: ', coordinate);
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

export function makeIDChiamata(): string {
    let text = '';
    const _lengthString = 2;
    const possible = '123456789';

    for (let i = 0; i < _lengthString; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `RM-0${text}`;
}

export function arraysEqual(array1: string[], array2: string[]): boolean {
    if (array1.length !== array2.length) {
        return false;
    }

    array1 = array1.slice();
    array1.sort();
    array2 = array2.slice();
    array2.sort();

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}

export function arrayUnique(arr: any[]) {
    return arr.filter((item, index) => {
        return arr.indexOf(item) >= index;
    });
}

// export function arrayDiff(a1, a2) {
//     return a1.filter(item => a2.indexOf(item) < 0);
// }
//
// export function randomNumber(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }

export function objectDiff(current: object, previous: object) {
    const newObj: object = {};
    const previousKeys = Object.keys(previous);
    let hasError = false;
    Object.keys(current).forEach((key, index) => {
        if (previousKeys[index] === key && !hasError) {
            newObj[key] = current[key] - previous[key];
        } else {
            hasError = true;
        }
    });
    return !hasError ? newObj : null;
}

export function round1decimal(value: number) {
    const decimal = value < 0.01 ? 1000 : 100;
    return Math.round(value * decimal) / decimal;
}

export function roundTodecimal(value: number, exp?: number) {
    const number = exp ? Math.pow(10, exp) : 10;
    return Math.round(value * number) / number;
}

export function calcolaActionSuggeritaMezzo(stato: StatoMezzo) {
    let actionSuggerita: StatoMezzoActions;
    switch (stato) {
        case StatoMezzo.InViaggio:
            actionSuggerita = StatoMezzoActions.SulPosto;
            break;
        case StatoMezzo.SulPosto:
            actionSuggerita = StatoMezzoActions.InRientro;
            break;
        case StatoMezzo.InRientro:
            actionSuggerita = StatoMezzoActions.Rientrato;
            break;
        case StatoMezzo.InSede:
            actionSuggerita = StatoMezzoActions.InViaggio;
            break;
        case StatoMezzo.Rientrato:
            actionSuggerita = StatoMezzoActions.InViaggio;
            break;
    }
    return actionSuggerita;
}

export function statoMezzoActionsEnumToStringArray(exceptStato?: string[]) {
    let stringArray = [];
    for (const val in StatoMezzoActions) {
        if (typeof StatoMezzoActions[val] === 'string') {
            stringArray.push(StatoMezzoActions[val]);
        }
    }
    // se c'è un'eccezione filtro l'array eliminando lo stato
    if (exceptStato && exceptStato.length > 0) {
        exceptStato.forEach((stato: string) => {
            stringArray = stringArray.filter((s: string) => s !== stato);
        });
    }
    return stringArray;
}

export function statoMezzoColor(stato: StatoMezzo) {
    let _returnColor = '';
    switch (stato) {
        case StatoMezzo.InSede:
            _returnColor = 'success';
            break;
        case StatoMezzo.Rientrato:
            _returnColor = 'success';
            break;
        case StatoMezzo.InViaggio:
            _returnColor = 'warning';
            break;
        case StatoMezzo.SulPosto:
            _returnColor = 'danger';
            break;
        case StatoMezzo.InRientro:
            _returnColor = 'verdemela';
            break;
        case StatoMezzo.Istituto:
            _returnColor = 'secondary';
            break;
    }
    return _returnColor;
}

export function statoMezzoActionColor(stato: StatoMezzoActions) {
    let _returnColor = '';
    switch (stato) {
        case StatoMezzoActions.Rientrato:
            _returnColor = 'success';
            break;
        case StatoMezzoActions.InViaggio:
            _returnColor = 'warning';
            break;
        case StatoMezzoActions.SulPosto:
            _returnColor = 'danger';
            break;
        case StatoMezzoActions.InRientro:
            _returnColor = 'verdemela';
            break;
    }
    return _returnColor;
}

export function statoMezzoBorderClass(stato: StatoMezzo) {
    let _returnClass = '';
    switch (stato) {
        case StatoMezzo.InSede:
            _returnClass = 'status_border_inSede';
            break;
        case StatoMezzo.Rientrato:
            _returnClass = 'status_border_inSede';
            break;
        case StatoMezzo.InViaggio:
            _returnClass = 'status_border_inViaggio';
            break;
        case StatoMezzo.SulPosto:
            _returnClass = 'status_border_sulPosto';
            break;
        case StatoMezzo.InRientro:
            _returnClass = 'status_border_inRientro';
            break;
        case StatoMezzo.Istituto:
            _returnClass = 'status_border_istituto';
            break;
    }
    return _returnClass;
}

export function calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta): StatoRichiestaActions {
    switch (richiesta.stato) {
        case StatoRichiesta.Chiusa:
            return StatoRichiestaActions.Riaperta;
        default:
            return StatoRichiestaActions.Chiusa;
    }
}


export function statoRichiestaActionsEnumToStringArray(exceptStato?: string[]) {
    let stringArray = [];
    for (const val in StatoRichiestaActions) {
        if (typeof StatoRichiestaActions[val] === 'string') {
            stringArray.push(StatoRichiestaActions[val]);
        }
    }
    // se c'è un'eccezione filtro l'array eliminando lo stato
    if (exceptStato && exceptStato.length > 0) {
        exceptStato.forEach((stato: string) => {
            stringArray = stringArray.filter((s: string) => s !== stato);
        });
    }
    return stringArray;
}

export function statoRichiestaColor(stato: string) {
    let _returnColor = '';
    switch (stato) {
        case StatoRichiesta.Chiusa:
            _returnColor = 'secondary';
            break;
        case StatoRichiesta.Assegnata:
            _returnColor = 'info';
            break;
        case StatoRichiesta.Presidiata:
            _returnColor = 'success';
            break;
        case StatoRichiesta.Sospesa:
            _returnColor = 'warning';
            break;
        case StatoRichiesta.Chiamata:
            _returnColor = 'danger';
            break;
    }
    return _returnColor;
}

export function visualizzaBoschiSterpaglie(tipologieRichiesta: Tipologia[]) {
    let count = 0;
    let _return = false;
    if (tipologieRichiesta) {
        tipologieRichiesta.forEach((tipologia: Tipologia) => {
            if (tipologia.boschivo) {
                count++;
            }
        });
    }
    count <= 0 ? _return = false : _return = true;
    return _return;
}

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function wipeStringUppercase(text: string) {
    return text.replace(/(?=[A-Z])/g, ' ').trim();
}

export function _isAdministrator(utente: Utente, options?: { sede?: Sede }) {
    let count = 0;
    if (!options || !options.sede) {
        for (const ruolo of utente.ruoli) {
            if (ruolo.descrizione === Role.Amministratore) {
                count += 1;
            }
        }
    } else {
        for (const ruolo of utente.ruoli) {
            if (ruolo.descrizione === Role.Amministratore && ruolo.codSede === options.sede.codice) {
                count += 1;
            }
        }
    }
    return count > 0;
}
