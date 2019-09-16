import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { Partenza } from '../../model/partenza.model';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { Store } from '@ngxs/store';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';

@Component({
    selector: 'app-lista-partenze',
    templateUrl: './lista-partenze.component.html',
    styleUrls: ['./lista-partenze.component.css']
})
export class ListaPartenzeComponent {

    @Input() partenze: Partenza[];
    @Input() statoRichiesta: StatoRichiesta;
    @Input() inGestione: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter<MezzoActionInterface>();

    constructor(private store: Store) {
    }

    onListaSquadrePartenza(listaSquadre: ListaSquadre) {
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }

    checkNumeroPartenze(partenze: Partenza[]) {
        let count = 0;
        if (partenze && partenze.length > 0) {
            partenze.forEach((p: Partenza) => {
                if (!p.sganciata) {
                    count++;
                }
            });
        }
        return count;
    }

    onActionMezzo(mezzoAction: MezzoActionInterface) {
        this.actionMezzo.emit(mezzoAction);
    }
}
