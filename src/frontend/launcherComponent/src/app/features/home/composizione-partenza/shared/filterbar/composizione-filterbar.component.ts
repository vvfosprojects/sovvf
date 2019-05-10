import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent implements OnInit {
    generiMezzi = [
        {
            id: '1',
            descrizione: 'APS'
        },
        {
            id: '2',
            descrizione: 'ABP'
        },
        {
            id: '3',
            descrizione: 'AG'
        },
        {
            id: '4',
            descrizione: 'AS'
        }
    ];
    stati = [
        {
            id: '1',
            descrizione: 'In Sede'
        },
        {
            id: '2',
            descrizione: 'In Rientro'
        },
        {
            id: '3',
            descrizione: 'In Viaggio'
        },
        {
            id: '4',
            descrizione: 'Sul Posto'
        }
    ];
    distaccamenti = [
        {
            id: '1',
            descrizione: 'Roma'
        },
        {
            id: '2',
            descrizione: 'Frosinone'
        },
        {
            id: '3',
            descrizione: 'Latina'
        },
        {
            id: '4',
            descrizione: 'Rieti'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    iconaStatiClass(stato: string) {
        let returnClass = '';

        switch (stato) {
            case 'In Sede':
                returnClass = 'text-secondary';
                break;
            case 'In Viaggio':
                returnClass = 'text-info';
                break;
            case 'In Rientro':
                returnClass = 'text-primary';
                break;
            case 'Sul Posto':
                returnClass = 'text-success';
                break;

            default:
                break;
        }

        return returnClass;
    }
}
