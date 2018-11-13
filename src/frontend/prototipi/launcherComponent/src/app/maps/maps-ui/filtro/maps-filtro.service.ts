import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

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
export class MapsFiltroService {
    constructor() {
    }

    filtroAttivo = ['richiesta'];

    menu: Menu[] = [
        {
            'id': 'richiesta',
            'index': 1,
            'isActive': true,
            'picture': 'icon-fa-richieste',
            'name': 'Richieste'
        },
        {
            'id': 'sede',
            'index': 2,
            'isActive': false,
            'picture': 'icon-fa-sedi',
            'name': 'Sedi'
        },
        {
            'id': 'mezzo',
            'index': 3,
            'isActive': false,
            'picture': 'icon-truck-fire-q',
            'name': 'Mezzi'
        }
    ];

    private subject = new Subject<Menu[]>();

    sendMenu(menu: Menu[]) {
        this.subject.next(menu);
        // console.log(menu);
    }

    getMenu(): Observable<Menu[]> {
        return this.subject.asObservable();
    }


    getVociMenu(): Observable<Menu[]> {
        return of(this.menu).pipe(delay(200));
    }
}
