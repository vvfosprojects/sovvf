import { StatoRichiesta } from '../enum/stato-richiesta.enum';
import { Coordinate } from '../model/coordinate.model';
import { CentroMappa } from '../../features/home/maps/maps-model/centro-mappa.model';
import { StatoMezzo } from '../enum/stato-mezzo.enum';
import { StatoMezzoActions } from '../enum/stato-mezzo-actions.enum';
import { SintesiRichiesta } from '../model/sintesi-richiesta.model';
import { StatoRichiestaActions } from '../enum/stato-richiesta-actions.enum';
import { Tipologia } from '../model/tipologia.model';
import { AreaMappa } from '../../features/home/maps/maps-model/area-mappa-model';
import { Role, Utente } from '../model/utente.model';
import { Sede } from '../model/sede.model';
import { LatLngBoundsLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { StatoFonogramma } from '../enum/stato-fonogramma.enum';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
import { TriageSummary } from '../interface/triage-summary.interface';
import { NecessitaSoccorsoAereoEnum } from '../enum/necessita-soccorso-aereo.enum';

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

export function makeID(lengthString?: number): string {
    let text = '';
    const stringLength = lengthString ? lengthString : 24;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < stringLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function makeIDChiamata(): string {
    let text = '';
    const stringLength = 2;
    const possible = '123456789';

    for (let i = 0; i < stringLength; i++) {
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

export function arrayUnique(arr: any[]): any[] {
    return arr.filter((item, index) => {
        return arr.indexOf(item) >= index;
    });
}

export function objectDiff(current: object, previous: object): object {
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

export function round1decimal(value: number): number {
    const decimal = value < 0.01 ? 1000 : 100;
    return Math.round(value * decimal) / decimal;
}

export function roundToDecimal(value: number, exp?: number): number {
    const numberRoundedToDecimal = exp > 0 ? Math.pow(10, exp) : 1;
    return Math.round(value * numberRoundedToDecimal) / numberRoundedToDecimal;
}

export function calcolaActionSuggeritaMezzo(stato: StatoMezzo): StatoMezzoActions {
    let actionMezzoSuggerita: StatoMezzoActions;
    switch (stato) {
        case StatoMezzo.InUscita:
            actionMezzoSuggerita = StatoMezzoActions.InViaggio;
            break;
        case StatoMezzo.InViaggio:
            actionMezzoSuggerita = StatoMezzoActions.SulPosto;
            break;
        case StatoMezzo.SulPosto:
            actionMezzoSuggerita = StatoMezzoActions.InRientro;
            break;
        case StatoMezzo.InRientro:
            actionMezzoSuggerita = StatoMezzoActions.Rientrato;
            break;
        case StatoMezzo.InSede:
            actionMezzoSuggerita = StatoMezzoActions.InViaggio;
            break;
        case StatoMezzo.Rientrato:
            actionMezzoSuggerita = StatoMezzoActions.InViaggio;
            break;
    }
    return actionMezzoSuggerita;
}

export function statoMezzoActionsEnumToStringArray(exceptStato?: string[]): string[] {
    let mezzoActionsString = [];
    for (const mezzoAction in StatoMezzoActions) {
        if (typeof StatoMezzoActions[mezzoAction] === 'string') {
            mezzoActionsString.push(StatoMezzoActions[mezzoAction]);
        }
    }
    // se c'è un'eccezione filtro l'array eliminando lo stato
    if (exceptStato && exceptStato.length > 0) {
        exceptStato.forEach((stato: string) => {
            mezzoActionsString = mezzoActionsString.filter((s: string) => s !== stato);
        });
    }
    return mezzoActionsString;
}

export function statoMezzoColor(stato: StatoMezzo): string {
    let mezzoColor = '';
    switch (stato) {
        case StatoMezzo.InSede:
            mezzoColor = 'success';
            break;
        case StatoMezzo.Rientrato:
            mezzoColor = 'success';
            break;
        case StatoMezzo.InUscita:
            mezzoColor = 'secondary';
            break;
        case StatoMezzo.InViaggio:
            mezzoColor = 'danger';
            break;
        case StatoMezzo.SulPosto:
            mezzoColor = 'danger';
            break;
        case StatoMezzo.InRientro:
            mezzoColor = 'success';
            break;
        case StatoMezzo.Istituto:
            mezzoColor = 'secondary';
            break;
    }
    return mezzoColor;
}

export function statoMezzoActionColor(stato: StatoMezzoActions): string {
    let mezzoActionColor = '';
    switch (stato) {
        case StatoMezzoActions.Rientrato:
            mezzoActionColor = 'success';
            break;
        case StatoMezzoActions.InUscita:
            mezzoActionColor = 'secondary';
            break;
        case StatoMezzoActions.InViaggio:
            mezzoActionColor = 'warning';
            break;
        case StatoMezzoActions.SulPosto:
            mezzoActionColor = 'danger';
            break;
        case StatoMezzoActions.InRientro:
            mezzoActionColor = 'verdemela';
            break;
    }
    return mezzoActionColor;
}

export function statoMezzoBorderClass(stato: StatoMezzo): string {
    let borderClass = '';
    switch (stato) {
        case StatoMezzo.InSede:
            borderClass = 'status_border_inSede';
            break;
        case StatoMezzo.Rientrato:
            borderClass = 'status_border_inSede';
            break;
        case StatoMezzo.InUscita:
            borderClass = 'status_border_inUscita';
            break;
        case StatoMezzo.InViaggio:
            borderClass = 'status_border_inViaggio';
            break;
        case StatoMezzo.SulPosto:
            borderClass = 'status_border_sulPosto';
            break;
        case StatoMezzo.InRientro:
            borderClass = 'status_border_inRientro';
            break;
        case StatoMezzo.Istituto:
            borderClass = 'status_border_istituto';
            break;
    }
    return borderClass;
}

export function calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta): StatoRichiestaActions {
    switch (richiesta.stato) {
        case StatoRichiesta.Chiusa:
            return StatoRichiestaActions.Riaperta;
        default:
            return StatoRichiestaActions.Chiusa;
    }
}

export function statoRichiestaActionsEnumToStringArray(exceptStato?: string[]): StatoRichiestaActions[] {
    let statiRichiestaString = [];
    for (const val in StatoRichiestaActions) {
        if (typeof StatoRichiestaActions[val] === 'string') {
            statiRichiestaString.push(StatoRichiestaActions[val]);
        }
    }
    // se c'è un'eccezione filtro l'array eliminando lo stato
    if (exceptStato && exceptStato.length > 0) {
        exceptStato.forEach((stato: string) => {
            statiRichiestaString = statiRichiestaString.filter((s: string) => s !== stato);
        });
    }
    return statiRichiestaString;
}

export function statoRichiestaColor(stato: string): string {
    let color = '';
    switch (stato) {
        case StatoRichiesta.Chiusa:
            color = 'secondary';
            break;
        case StatoRichiesta.Assegnata:
            color = 'info';
            break;
        case StatoRichiesta.Presidiata:
            color = 'success';
            break;
        case StatoRichiesta.Sospesa:
            color = 'warning';
            break;
        case StatoRichiesta.Chiamata:
            color = 'danger';
            break;
    }
    return color;
}

export function visualizzaBoschiSterpaglie(tipologieRichiesta: Tipologia[]): boolean {
    let count = 0;
    let visualizza = false;
    if (tipologieRichiesta) {
        tipologieRichiesta.forEach((tipologia: Tipologia) => {
            if (tipologia.boschivo) {
                count++;
            }
        });
    }
    count <= 0 ? visualizza = false : visualizza = true;
    return visualizza;
}

export function onlyUnique(value, index, self): boolean {
    return self.indexOf(value) === index;
}

export function wipeStringUppercase(text: string): string {
    return text.replace(/(?=[A-Z])/g, ' ').trim();
}

export function _isAdministrator(utente: Utente, options?: { sede?: Sede }): boolean {
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

export function getStatoFonogrammaEnumByName(name: string): StatoFonogramma {
    switch (name) {
        case 'Inviato':
            return StatoFonogramma.Inviato;
        case 'Da Inviare':
            return StatoFonogramma.DaInviare;
    }
}

export function getStatoFonogrammaStringByEnum(fonogrammaEnum: StatoFonogramma): string {
    switch (fonogrammaEnum) {
        case StatoFonogramma.Inviato:
            return 'Inviato';
        case StatoFonogramma.DaInviare:
            return 'Da Inviare';
    }
}

export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.substring(1);
}

export function addQuestionMark(value: string): string {
    const questionMarked = value.indexOf('?') !== -1;
    if (!questionMarked) {
        return value + '?';
    } else {
        return value;
    }
}

export function getSoccorsoAereoTriage(triageSummary: TriageSummary[]): { desc: NecessitaSoccorsoAereoEnum | string, value: number } {
    if (!!triageSummary) {
        let soccorsoAereoTriage: string;
        for (const summary of triageSummary) {
            const soccorsoAereo = summary.soccorsoAereo;
            if (soccorsoAereo) {
                soccorsoAereoTriage = soccorsoAereo;
            }
        }
        switch (soccorsoAereoTriage) {
            case NecessitaSoccorsoAereoEnum.NonNecessario:
                return {
                    desc: NecessitaSoccorsoAereoEnum.NonNecessario,
                    value: 1
                };
            case NecessitaSoccorsoAereoEnum.Utile:
                return {
                    desc: NecessitaSoccorsoAereoEnum.Utile,
                    value: 2
                };
            case NecessitaSoccorsoAereoEnum.MoltoUtile:
                return {
                    desc: NecessitaSoccorsoAereoEnum.MoltoUtile,
                    value: 3
                };
            case NecessitaSoccorsoAereoEnum.Indispensabile:
                return {
                    desc: NecessitaSoccorsoAereoEnum.Indispensabile,
                    value: 4
                };
        }
    }
    return {
        desc: 'Non Impostata',
        value: 0
    };
}
