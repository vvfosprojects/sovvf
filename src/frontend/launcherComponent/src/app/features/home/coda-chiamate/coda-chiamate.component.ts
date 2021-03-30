import { Component, OnInit } from '@angular/core';
import { ItemChart } from '../../../shared/interface/item-chart.interface';

@Component({
    selector: 'app-coda-chiamate',
    templateUrl: './coda-chiamate.component.html',
    styleUrls: ['./coda-chiamate.component.scss']
})
export class CodaChiamateComponent implements OnInit {

    data = [
        {
            name: 'Comando di Roma',
            series: [
                {
                    name: 'Richieste',
                    value: 20,
                    extra: {
                        code: 'RM.1000'
                    }
                },
                {
                    name: 'Squadre Libere',
                    value: 3,
                    extra: {
                        code: 'RM.1000'
                    }
                },
                {
                    name: 'Squadre Occupate',
                    value: 1,
                    extra: {
                        code: 'RM.1000'
                    }
                },
            ]
        },
        {
            name: 'Monte Mario',
            series: [
                {
                    name: 'Richieste',
                    value: 5,
                    extra: {
                        code: 'RM.1001'
                    }
                },
                {
                    name: 'Squadre Libere',
                    value: 1,
                    extra: {
                        code: 'RM.1001'
                    }
                },
                {
                    name: 'Squadre Occupate',
                    value: 2,
                    extra: {
                        code: 'RM.1001'
                    }
                },
            ]
        },
        {
            name: 'Tuscolana II',
            series: [
                {
                    name: 'Richieste',
                    value: 5,
                    extra: {
                        code: 'RM.1002'
                    }
                },
                {
                    name: 'Squadre Libere',
                    value: 1,
                    extra: {
                        code: 'RM.1002'
                    }
                },
                {
                    name: 'Squadre Occupate',
                    value: 3,
                    extra: {
                        code: 'RM.1002'
                    }
                },
            ]
        }
    ] as ItemChart[];

    constructor() {
    }

    ngOnInit(): void {
    }

    onSelect(data: ItemChart): void {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data: ItemChart): void {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data: ItemChart): void {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
}
