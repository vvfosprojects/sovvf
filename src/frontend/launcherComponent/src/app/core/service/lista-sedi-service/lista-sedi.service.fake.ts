import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TreeItem } from 'ngx-treeview';

@Injectable({
    providedIn: 'root'
})
export class ListaSediServiceFake {

    listaSedi: TreeItem;

    constructor() {
    }

    getListaSedi(): Observable<TreeItem> {
        this.listaSedi = {
            text: 'CON', value: 'CON.0000', children: [
                {
                    text: 'Direzione Regionale VV.F. Lazio', value: 'LZ.0000', children: [
                        {
                            text: 'Comando VV.F. di Roma', value: 'RM.1000', children: [
                                { text: 'Distaccamento Cittadino La Rustica', value: 'RM.1001' },
                                { text: 'Distaccamento Cittadino Eur', value: 'RM.1002' },
                                { text: 'Distaccamento Cittadino Fluviale', value: 'RM.1003' }
                            ]
                        },
                        {
                            text: 'Comando VV.F. di Latina', value: 'LT.1000', children: [
                                { text: 'Distaccamento Provinciale di Gaeta', value: 'LT.1001' },
                                { text: 'Distaccamento Provinciale di Terracina', value: 'LT.1002' },
                                { text: 'Distaccamento Provinciale di Aprilia', value: 'LT.1003' }
                            ]
                        },
                        {
                            text: 'Comando VV.F. di Frosinone', value: 'FR.1000', children: [
                                { text: 'Distaccamento Provinciale di Cassino', value: 'FR.1001' },
                                { text: 'Distaccamento Provinciale di Fiuggi', value: 'FR.1002' },
                                { text: 'Distaccamento Provinciale di Sora', value: 'FR.1003' }
                            ]
                        }]
                },
                {
                    text: 'Direzione Regionale VV.F. Toscana', value: 'TO.0000', children: [
                        {
                            text: 'Comando VV.F. di Grosseto', value: 'GR.1000', children: [
                                { text: 'Distaccamento Provinciale di Arcidosso', value: 'GR.1001' },
                                { text: 'Distaccamento Provinciale di Follonica', value: 'GR.1002' },
                                { text: 'Distaccamento Provinciale di Orbetello', value: 'GR.1003' }
                            ]
                        },
                        {
                            text: 'Comando VV.F. di Livorno', value: 'LI.1000', children: [
                                { text: 'Distaccamento Provinciale di Cecina', value: 'LI.1001' },
                                { text: 'Distaccamento Provinciale di Piombino', value: 'LI.1002' },
                                { text: 'Distaccamento Provinciale di Portoferrai', value: 'LI.1003' }
                            ]
                        }]
                },
                {
                    text: 'Direzione Regionale VV.F. Puglia', value: 'PU.0000', children: [
                        {
                            text: 'Comando VV.F. di Bari', value: 'BA.1000', children: [
                                { text: 'Distaccamento Provinciale Bari1', value: 'BA.1001' },
                                { text: 'Distaccamento Provinciale Bari2', value: 'BA.1002' }
                            ]
                        },
                        {
                            text: 'Comando VV.F. di Brindisi', value: 'BR.1000', children: [
                                { text: 'Distaccamento Provinciale di Brindisi1', value: 'BR.1001' },
                                { text: 'Distaccamento Provinciale di Brindisi2', value: 'BR.1002' }
                            ]
                        }]
                }]
        };
        return of(this.listaSedi);
    }
}
