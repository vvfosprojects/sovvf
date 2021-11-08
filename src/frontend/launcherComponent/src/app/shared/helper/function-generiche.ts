import { Role, Utente } from '../model/utente.model';
import { Sede } from '../model/sede.model';

export function makeCopy(value): any {
    return (JSON.parse(JSON.stringify(value)));
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


