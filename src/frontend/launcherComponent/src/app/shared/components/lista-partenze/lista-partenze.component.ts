import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { Partenza } from '../../model/partenza.model';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { Store } from '@ngxs/store';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';
import { checkNumeroPartenzeAttive } from '../../helper/function-richieste';
import { Mezzo } from '../../model/mezzo.model';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { InfoMezzo } from '../../store/states/loading/loading.state';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { RemoveAnnullaStatoMezzi } from '../../store/actions/loading/loading.actions';
import * as moment from 'moment';

@Component({
    selector: 'app-lista-partenze',
    templateUrl: './lista-partenze.component.html',
    styleUrls: ['./lista-partenze.component.css']
})
export class ListaPartenzeComponent {

    @Input() richiesta: SintesiRichiesta;
    @Input() idDaSganciare: string;
    @Input() inGestione: boolean;
    @Input() sostituzioneFineTurnoActive: boolean;
    @Input() loadingActionMezzo: string[];
    @Input() annullaStatoMezzi: InfoMezzo[];
    @Input() disabledModificaStatoMezzo: boolean;

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

    checkAnnullaStatoMezzo(codMezzo: string, statoMezzo: StatoMezzo): boolean {
        const annullaStatoMezzo = this.annullaStatoMezzi?.filter((iM: InfoMezzo) => iM.codMezzo === codMezzo && iM.stato === statoMezzo)[0];
        if (annullaStatoMezzo) {
            const unMinutoFa = new Date();
            unMinutoFa.setMinutes(unMinutoFa.getMinutes() - 1);
            if (!moment(annullaStatoMezzo.istante).isAfter(unMinutoFa)) {
                this.store.dispatch(new RemoveAnnullaStatoMezzi([codMezzo], statoMezzo));
            }
            return moment(annullaStatoMezzo.istante).isAfter(unMinutoFa);
        }
        return false;
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        this.actionMezzo.emit(mezzoAction);
    }

}
