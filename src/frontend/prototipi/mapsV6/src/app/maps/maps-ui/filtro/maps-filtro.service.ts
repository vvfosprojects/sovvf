import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface Menu {
    id: string;
    index: number;
    isActive: boolean;
    picture: string;
    name: string;
    disabled?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor() {
    }


    getVociMarker(): Observable<Menu[]> {
        return of(vociMarker()).pipe(delay(200));
    }
}

function vociMarker() {
    return [
        {
            'id': 'richiesta',
            'index': 1,
            'isActive': false,
            'picture': 'fa fa-calendar-plus-o',
            'name': 'Richieste'
        },
        {
            'id': 'mezzo',
            'index': 2,
            'isActive': false,
            'picture': 'fa fa-truck',
            'name': 'Mezzi'
        },
        {
            'id': 'sede',
            'index': 3,
            'isActive': false,
            'picture': 'fa fa-university',
            'name': 'Sedi'
        }
    ];
}
