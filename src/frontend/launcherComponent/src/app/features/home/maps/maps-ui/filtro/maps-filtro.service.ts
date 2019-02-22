import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BoxClickArrayInterface, BoxClickInterface } from '../../../boxes/box-interface/box-click-interface';
import { Select } from '@ngxs/store';
import { BoxClickState } from '../../../boxes/store/';

@Injectable()
export class MapsFiltroService implements OnDestroy {

    @Select(BoxClickState.boxClick) boxClick$: Observable<BoxClickInterface>;
    subscription = new Subscription();

    constructor() {
        this.subscription.add(
            this.boxClick$.subscribe((boxClick: BoxClickInterface) => {
                // Todo: bloccano l'app
                    // this.checkBoxClick(boxClick);
                    // this.filtroBoxes.next(this.stateBoxClick(boxClick));
                }
            ));
    }

    filtroAttivo = ['richiesta'];

    filtroAttivoCopy: string[];

    filtroCheckBox: string[] = [];

    private filtroMarker: Menu[] = [
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

    private vociMenu = new Subject<Menu[]>();

    private filtroBoxes = new Subject<BoxClickArrayInterface>();

    private static getCopy(value): any {
        return (JSON.parse(JSON.stringify(value)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    createCopyFiltro() {
        if (!this.filtroAttivoCopy) {
            this.filtroAttivoCopy = MapsFiltroService.getCopy(this.filtroAttivo);
        }
    }

    deleteCopyFiltro() {
        this.filtroAttivoCopy = undefined;
    }

    checkBoxClick(boxClick: BoxClickInterface) {
        this.filtroCheckBox = [];
        if (Object.values(boxClick.mezzi).indexOf(true) >= 0) {
            pushFiltro('mezzo', this.filtroCheckBox);
        }

        if (Object.values(boxClick.richieste).indexOf(true) >= 0) {
            pushFiltro('richiesta', this.filtroCheckBox);
        }

        function pushFiltro(string: string, array: any[]) {
            if (!array.includes(string)) {
                array.push(string);
            }
        }

        if (this.filtroCheckBox.length !== 0) {
            this.createCopyFiltro();
            this.filtroAttivo = this.filtroCheckBox;
        } else {
            this.filtroAttivo = this.filtroAttivoCopy;
            this.deleteCopyFiltro();
        }

        this.filtroMarker.forEach(r => {
            if (this.filtroAttivo) {
                this.filtroAttivo.includes(r.id) ? r.isActive = true : r.isActive = false;
            }
        });
        this.vociMenu.next(this.filtroMarker);
    }

    stateBoxClick(boxClick: BoxClickInterface): BoxClickArrayInterface {

        const boxClickArray: BoxClickArrayInterface = {
            richieste: [],
            mezzi: []
        };
        const mezzi = Object.keys(boxClick.mezzi);
        const richieste = Object.keys(boxClick.richieste);

        boxClickArray.mezzi = mezzi.filter(key => {
            return boxClick.mezzi[key];
        });

        boxClickArray.richieste = richieste.filter(key => {
            return boxClick.richieste[key];
        });

        return boxClickArray;
    }

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
            this.vociMenu.next(menuIsNotActive);
        } else {
            this.vociMenu.next(menu);
        }
    }

    getMenu(): Observable<Menu[]> {
        return this.vociMenu.asObservable();
    }

    getFiltroBoxes(): Observable<BoxClickArrayInterface> {
        return this.filtroBoxes.asObservable();
    }

    getVociMenu(): Observable<Menu[]> {
        return of(this.filtroMarker).pipe(delay(200));
    }
}

export interface Menu {
    id: string;
    index: number;
    isActive: boolean;
    picture: string;
    name: string;
}
