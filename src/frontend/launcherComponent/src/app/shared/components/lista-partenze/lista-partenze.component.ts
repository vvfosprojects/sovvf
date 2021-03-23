import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { Partenza } from '../../model/partenza.model';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { Select, Store } from '@ngxs/store';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';
import { Observable } from 'rxjs';
import { EventoMezzo } from '../../interface/evento-mezzo.interface';

@Component({
    selector: 'app-lista-partenze',
    templateUrl: './lista-partenze.component.html',
    styleUrls: ['./lista-partenze.component.css']
})
export class ListaPartenzeComponent {

    @Input() idDaSganciare: string;
    @Input() partenze: Partenza[];
    @Input() listaEventi: EventoMezzo[];
    @Input() statoRichiesta: StatoRichiesta;
    @Input() inGestione: boolean;
    @Input() sostituzioneFineTurnoActive: boolean;
    @Input() doubleMonitor: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter<MezzoActionInterface>();
    @Output() eliminaPartenza: EventEmitter<string> = new EventEmitter<string>();
    @Output() modificaPartenza: EventEmitter<string> = new EventEmitter<string>();
    @Output() sostituzioneFineTurno: EventEmitter<any> = new EventEmitter<any>();

    @Select(RichiesteState.loadingActionMezzo) loadingActionMezzo$: Observable<string>;

    loadingActionMezzoArray: any[] = [];

    constructor(private store: Store) {
    }

    onListaSquadrePartenza(listaSquadre: ListaSquadre): void {
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }

    checkNumeroPartenze(partenze: Partenza[]): number {
        let count = 0;
        if (partenze && partenze.length > 0) {
            partenze.forEach((p: Partenza) => {
                if (!p.sganciata && !p.partenzaAnnullata && !p.terminata) {
                    count++;
                }
            });
        }
        return count;
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        this.actionMezzo.emit(mezzoAction);
        if (mezzoAction.mezzo.codice && !this.loadingActionMezzoArray.includes(mezzoAction.mezzo.codice)) {
            this.loadingActionMezzoArray.push(mezzoAction.mezzo.codice);
        } else if (!mezzoAction.mezzo.codice) {
            this.loadingActionMezzoArray.shift();
        }
    }

}
