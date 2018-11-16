import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UnitaOperativaTreeviewService {

    sedi: TreeviewItem[];

    constructor() {
    }

    getSedi(): Observable<TreeviewItem[]> {
        this.sedi = [
            new TreeviewItem({
                text: 'CON', value: 9, collapsed: false, children: [
                    {
                        text: 'Direzione Regionale VV.F. Lazio',
                        value: 100,
                        collapsed: false,
                        checked: true,
                        children: [
                            {text: 'Comando di Roma', value: 101, checked: true},
                            {text: 'Comando di Latina', value: 102, checked: false},
                            {text: 'Comando di Frosinone', value: 103, checked: false},
                            {text: 'Comando di Rieti', value: 104, checked: false},
                            {text: 'Comando di Viterbo', value: 105, checked: false}
                        ]
                    },
                    {
                        text: 'Direzione Regionale VV.F. Toscana',
                        value: 200,
                        collapsed: true,
                        checked: false,
                        children: [
                            {text: 'Comando di Arezzo', value: 201, checked: false},
                            {text: 'Comando di Firenze', value: 202, checked: false},
                            {text: 'Comando di Grosseto', value: 203, checked: false},
                            {text: 'Comando di Livorno', value: 204, checked: false},
                            {text: 'Comando di Lucca', value: 205, checked: false},
                            {text: 'Comando di Massa Carrara', value: 206, checked: false},
                            {text: 'Comando di Pisa', value: 207, checked: false},
                            {text: 'Comando di Pistoia', value: 208, checked: false},
                            {text: 'Comando di Prato', value: 209, checked: false},
                            {text: 'Comando di Siena', value: 210, checked: false}
                        ]
                    }]
            })];

        return of(this.sedi);
    }
}
