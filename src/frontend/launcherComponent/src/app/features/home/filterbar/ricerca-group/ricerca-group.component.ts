import { Component, Input } from '@angular/core';
import { VoceFiltro } from './filtri-richieste/voce-filtro.model';

@Component({
    selector: 'app-ricerca-group',
    templateUrl: './ricerca-group.component.html',
    styleUrls: ['./ricerca-group.component.css']
})
export class RicercaGroupComponent {
    @Input() filtriSelezionati: VoceFiltro[];
}
