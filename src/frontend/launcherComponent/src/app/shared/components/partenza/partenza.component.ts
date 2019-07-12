import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { ListaSquadre } from '../../interface/lista-squadre';

@Component({
    selector: 'app-partenza',
    templateUrl: './partenza.component.html',
    styleUrls: ['./partenza.component.css']
})
export class PartenzaComponent {

    @Input() partenza: Partenza;
    @Input() index: number; // provvisorio
    @Output() listaSquadre = new EventEmitter<ListaSquadre>();

    onListaSquadrePartenza() {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = '' + (this.index + 1); // provvisorio
        listaSquadre.squadre = this.partenza.squadre;
        this.listaSquadre.emit(listaSquadre);
    }

}
