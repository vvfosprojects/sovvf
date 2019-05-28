import { Component, Input } from '@angular/core';
import { FilterbarService } from '../../../../../core/service/comp-partenza-service/filterbar-composizione-service/filterbar.service';
import { Store } from '@ngxs/store';
import {
    AddFiltroSelezionatoComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione
} from '../../../store/actions/composizione-partenza/filterbar-composizione.actions';

@Component({
    selector: 'app-composizione-filterbar',
    templateUrl: './composizione-filterbar.component.html',
    styleUrls: ['./composizione-filterbar.component.css']
})
export class ComposizioneFilterbarComponent {

    @Input() filtri: any;

    constructor(private filterbarService: FilterbarService,
                private store: Store) {
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
        this.filterbarService.getFiltri().subscribe(() => {
        });
    }

    addFiltro(event: any, tipo: string) {
        // console.log('Filtro deselezionato', event);
        this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id, tipo));
    }

    removeFiltro(event: any, tipo: string) {
        // console.log('Filtro deselezionato', event);
        this.store.dispatch(new RemoveFiltroSelezionatoComposizione(event.value.id, tipo));
    }

    clearFiltri(tipo: string) {
        // console.log('Filtri deselezionati', tipo);
        this.store.dispatch(new RemoveFiltriSelezionatiComposizione(tipo));
    }
}
