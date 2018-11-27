import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MapsFiltroService {
    constructor() {
    }

    meteoSwitchDefault = false;

    filtroAttivo = ['richiesta'];

    filtroMarker: Menu[] = [
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

    private meteoSwitch = new Subject<boolean>();

    sendMenu(menu: Menu[]) {
        let count = 0;
        const menuIsNotActive = menu;
        menu.forEach(r => {
            if (r.isActive) {
                count++;
            }
        });
        if (menu.length === count) {
            menuIsNotActive.forEach(r => {
                r.isActive = false;
            });
            this.subject.next(menuIsNotActive);
        } else {
            this.subject.next(menu);
        }
    }

    getMenu(): Observable<Menu[]> {
        return this.subject.asObservable();
    }


    getVociMenu(): Observable<Menu[]> {
        return of(this.filtroMarker).pipe(delay(200));
    }

    sendMeteoSwitch(result: boolean) {
        this.meteoSwitchDefault = result;
        this.meteoSwitch.next(result);
    }

    getMeteoSwitch(): Observable<boolean> {
        return this.meteoSwitch.asObservable();
    }
}

export interface Menu {
    id: string;
    index: number;
    isActive: boolean;
    picture: string;
    name: string;
}
