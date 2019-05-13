import { Component, Input } from '@angular/core';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent {

    @Input() filtri: any;

    constructor(private compPartenzaService: CompPartenzaService) {
        this.getFiltri();
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

    getFiltri() {
        this.compPartenzaService.getFiltri().subscribe((res: any) => {
        });
    }
}
