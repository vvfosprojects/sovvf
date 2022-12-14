import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListaSquadre } from '../../interface/lista-squadre';
import { Partenza } from '../../model/partenza.model';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { Store } from '@ngxs/store';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';
import { checkNumeroPartenzeAttive, getPartenzeAttive } from '../../helper/function-richieste';
import { Mezzo } from '../../model/mezzo.model';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { InfoMezzo } from '../../store/states/loading/loading.state';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { RemoveAnnullaStatoMezzi } from '../../store/actions/loading/loading.actions';
import { EventoMezzo } from '../../interface/evento-mezzo.interface';
import { MezzoRientratoVisibileRichiesta } from '../../interface/mezzo-rientrato-visibile-richiesta.interface';
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
  @Input() onlyPartenzeAttive: boolean;
  @Input() dateSync: Date;
  @Input() codMezziRientratiVisibili: MezzoRientratoVisibileRichiesta;

  @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter<MezzoActionInterface>();
  @Output() modificaPartenza: EventEmitter<string> = new EventEmitter<string>();
  @Output() selezioneMezzo: EventEmitter<Mezzo> = new EventEmitter<Mezzo>();
  @Output() sostituzioneFineTurno: EventEmitter<any> = new EventEmitter<any>();

  tipoConcorrenzaEnum = TipoConcorrenzaEnum;
  statoMezzoEnum = StatoMezzo;
  constructor(private store: Store) {
  }

  onListaSquadrePartenza(codiceMezzo: string, listaSquadre: ListaSquadre, siglaMezzo: string, descMezzo: string): void {
    this.store.dispatch(new VisualizzaListaSquadrePartenza(codiceMezzo, listaSquadre, siglaMezzo, descMezzo));
  }

  checkNumeroPartenze(partenze: Partenza[]): number {
    const annullaStatoMezzoRientrato = this.annullaStatoMezzi?.filter((x: InfoMezzo) => x.stato === StatoMezzo.Rientrato)[0];
    return this.onlyPartenzeAttive ? checkNumeroPartenzeAttive(partenze) : checkNumeroPartenzeAttive(partenze, this.codMezziRientratiVisibili, annullaStatoMezzoRientrato);
  }

  getPartenze(partenze: Partenza[]): Partenza[] {
    const annullaStatoMezzoRientrato = this.annullaStatoMezzi?.filter((x: InfoMezzo) => x.stato === StatoMezzo.Rientrato)[0];
    return this.onlyPartenzeAttive ? getPartenzeAttive(partenze) : getPartenzeAttive(partenze, this.codMezziRientratiVisibili, annullaStatoMezzoRientrato);
  }

  getUltimoStatoMezzo(codMezzo: string): StatoMezzo {
    const eventoCodMezzo = this.richiesta.eventi.filter((evento: EventoMezzo) => evento.codiceMezzo === codMezzo);
    if (eventoCodMezzo) {
      const eventoUltimoStatoMezzo = eventoCodMezzo[eventoCodMezzo?.length - 1];
      return eventoUltimoStatoMezzo.stato;
    }
  }

  checkAltriStatiMezzo(eventi: EventoMezzo[], statoMezzo: StatoMezzo, codiceMezzo: string): boolean {
    const eventoMezzo = eventi.filter((ev: EventoMezzo) => ev.codiceMezzo == codiceMezzo)
    let result: boolean = true;
    if (eventoMezzo.length > 2){
      result = eventoMezzo[eventoMezzo.length - 1].ora > eventoMezzo[eventoMezzo.length - 2].ora;

    }
    return result
  }

  checkAnnullaStatoMezzo(codMezzo: string, statoMezzo: StatoMezzo, codPartenza: string, flag: boolean): boolean {
    const annullaStatoMezzo = this.annullaStatoMezzi?.filter((iM: InfoMezzo) => iM.codMezzo === codMezzo && iM.stato === statoMezzo && iM.codicePartenza === codPartenza)[0];
    if (annullaStatoMezzo && flag) {
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
