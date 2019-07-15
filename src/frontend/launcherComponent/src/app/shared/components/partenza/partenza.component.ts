import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { ListaSquadre } from '../../interface/lista-squadre';
import { Mezzo } from '../../model/mezzo.model';

@Component({
    selector: 'app-partenza',
    templateUrl: './partenza.component.html',
    styleUrls: ['./partenza.component.css']
})
export class PartenzaComponent {

    @Input() partenza: Partenza;
    @Output() listaSquadre = new EventEmitter<ListaSquadre>();
    @Output() mezzoArrivatoSulPosto: EventEmitter<any> = new EventEmitter();

    onListaSquadrePartenza() {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.partenza.squadre;
        this.listaSquadre.emit(listaSquadre);
    }

    onMezzoArrivatoSulPosto(mezzo: Mezzo) {
        this.mezzoArrivatoSulPosto.emit(mezzo);
    }
}
