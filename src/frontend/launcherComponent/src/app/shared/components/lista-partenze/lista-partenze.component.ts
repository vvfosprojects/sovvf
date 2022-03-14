import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { Partenza } from '../../model/partenza.model';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { Store } from '@ngxs/store';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';
import { EventoMezzo } from '../../interface/evento-mezzo.interface';
import { checkNumeroPartenzeAttive } from '../../helper/function-richieste';
import { Mezzo } from '../../model/mezzo.model';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-lista-partenze',
    templateUrl: './lista-partenze.component.html',
    styleUrls: ['./lista-partenze.component.css']
})
export class ListaPartenzeComponent {

    @Input() codiceRichiesta: string;
    @Input() idDaSganciare: string;
    @Input() partenze: Partenza[];
    @Input() listaEventi: EventoMezzo[];
    @Input() statoRichiesta: StatoRichiesta;
    @Input() inGestione: boolean;
    @Input() sostituzioneFineTurnoActive: boolean;
    @Input() loadingActionMezzo: string[];
    @Input() annullaStatoMezzi: string[];

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter<MezzoActionInterface>();
    @Output() eliminaPartenza: EventEmitter<string> = new EventEmitter<string>();
    @Output() modificaPartenza: EventEmitter<string> = new EventEmitter<string>();
    @Output() selezioneMezzo: EventEmitter<Mezzo> = new EventEmitter<Mezzo>();
    @Output() sostituzioneFineTurno: EventEmitter<any> = new EventEmitter<any>();

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor(private store: Store) {
    }

    onListaSquadrePartenza(codiceMezzo: string, listaSquadre: ListaSquadre): void {
        this.store.dispatch(new VisualizzaListaSquadrePartenza(codiceMezzo, listaSquadre));
    }

    checkNumeroPartenzeAttive(partenze: Partenza[]): number {
        return checkNumeroPartenzeAttive(partenze);
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        this.actionMezzo.emit(mezzoAction);
    }

}
