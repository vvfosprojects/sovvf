import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { ListaSquadre } from '../../interface/lista-squadre';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';

@Component({
    selector: 'app-partenza',
    templateUrl: './partenza.component.html',
    styleUrls: ['./partenza.component.css']
})
export class PartenzaComponent {

    @Input() partenza: Partenza;
    @Input() inGestione: boolean;
    @Input() statoRichiesta: StatoRichiesta;

    @Output() listaSquadre = new EventEmitter<ListaSquadre>();
    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();

    statoRichiestaEnum = StatoRichiesta;

    onListaSquadrePartenza() {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.partenza.squadre;
        this.listaSquadre.emit(listaSquadre);
    }

    onActionMezzo(mezzoAction: MezzoActionInterface) {
        this.actionMezzo.emit(mezzoAction);
    }
}
