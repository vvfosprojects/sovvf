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
import { EventoMezzo } from '../../interface/evento-mezzo.interface';
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
    @Input() hideSostituzioneFineTurno: boolean;
    @Input() hideGestisciPartenza: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter<MezzoActionInterface>();
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

    getUltimoStatoMezzo(codMezzo: string): StatoMezzo {
        const eventoCodMezzo = this.richiesta.eventi.filter((evento: EventoMezzo) => evento.codiceMezzo === codMezzo);
        if (eventoCodMezzo) {
            const eventoUltimoStatoMezzo = eventoCodMezzo[eventoCodMezzo?.length - 1];
            return eventoUltimoStatoMezzo.stato;
        }
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

    getSostituzioneFineTurnoVisible(): boolean {
        // tslint:disable-next-line:max-line-length
        return !this.hideSostituzioneFineTurno && this.inGestione && this.sostituzioneFineTurnoActive && !this.richiesta.partenze?.some((p: Partenza) => !p.partenza.partenzaAnnullata && !p.partenza.terminata && !p.partenza.sganciata && this.loadingActionMezzo?.includes(p.partenza.mezzo.codice));
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        this.actionMezzo.emit(mezzoAction);
    }

}
