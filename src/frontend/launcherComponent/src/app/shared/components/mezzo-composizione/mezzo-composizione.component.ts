import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { MezzoDirection } from '../../interface/mezzo-direction';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { iconaStatiClass, mezzoComposizioneBusy } from '../../helper/composizione-functions';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { Sede } from '../../model/sede.model';
import {Select} from '@ngxs/store';
import {ViewComponentState} from '../../../features/home/store/states/view/view.state';
import {Observable, Subscription} from 'rxjs';
import {ViewLayouts} from '../../interface/view.interface';
import {Partenza} from '../../model/partenza.model';
import {Squadra} from '../../model/squadra.model';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit, OnChanges {
    @Input() mezzoComp: MezzoComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Input() partenze: BoxPartenza[];
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemPrenotato: boolean;
    @Input() itemInPrenotazione: boolean;
    @Input() itemBloccato: boolean;
    @Input() nightMode: boolean;
    @Input() boxPartenzaList: BoxPartenza[];

    @Output() selezionato = new EventEmitter<MezzoComposizione>();
    @Output() deselezionato = new EventEmitter<MezzoComposizione>();
    @Output() hoverIn = new EventEmitter<MezzoComposizione>();
    @Output() hoverOut = new EventEmitter<MezzoComposizione>();
    @Output() sbloccato = new EventEmitter<MezzoComposizione>();
    @Output() startTimeout = new EventEmitter<MezzoComposizione>();
    @Output() stopTimeout = new EventEmitter<MezzoComposizione>();
    @Output() mezzoCoordinate = new EventEmitter<MezzoDirection>();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;


    public sganciamentoDisabilitato = false;
    private subscription = new Subscription();
    viewState: ViewLayouts;
    itemPrenotatoInBox = false;

    constructor() {
    this.getViewState();
    }

    ngOnInit(): void {
        this.sganciamentoCheck();
        this.mezzoInPartenzaCheck();
    }

    ngOnChanges(changes: SimpleChanges): void {
      const boxPartenzaList = changes['boxPartenzaList'];
      if (boxPartenzaList && boxPartenzaList.currentValue && boxPartenzaList.previousValue && this.boxPartenzaList.length > 0 && (boxPartenzaList.currentValue.length !== boxPartenzaList.previousValue.length)) {
        let shouldSkip = false;
        boxPartenzaList.previousValue.forEach(x => (!x.mezzoComp && x.squadreComposizione.length) <= 0 ? shouldSkip = true : null);
        boxPartenzaList.currentValue.forEach(x => (!x.mezzoComp && x.squadreComposizione.length) <= 0 ? shouldSkip = false : null);
        if (shouldSkip) { return; }
        boxPartenzaList.currentValue.forEach( x => x.mezzoComposizione && (x.mezzoComposizione.id !== this.mezzoComp.id) ? this.itemPrenotatoInBox = false :  null);
        if ((boxPartenzaList.currentValue.length < boxPartenzaList.previousValue.length) && !boxPartenzaList.currentValue[0].mezzoComposizione ) {
          this.itemPrenotatoInBox = false;
        }
      }
    }

    getViewState(): void {
      this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    mezzoInPartenzaCheck(): void {
      if (this.mezzoComp && this.mezzoComp.id && this.boxPartenzaList && this.boxPartenzaList.length > 1 ) {
        this.boxPartenzaList.forEach( (x, i) => x.mezzoComposizione && (x.mezzoComposizione.id === this.mezzoComp.id) && this.boxPartenzaList[i + 1] ? this.itemPrenotatoInBox = true :  null);
      }
    }

    sganciamentoCheck(): void {
        if (this.richiesta && this.richiesta.partenzeRichiesta && this.richiesta.partenzeRichiesta.length > 0) {
            this.sganciamentoDisabilitato = !!this.richiesta.partenzeRichiesta.find(e => {
                return e.mezzo.descrizione === this.mezzoComp.mezzo.descrizione &&
                    !e.sganciata && !e.terminata && !e.partenzaAnnullata;
            });
        }
    }

    onClick(): void {
        if (!this.itemSelezionato && !this.mezzoComp.istanteScadenzaSelezione && !this.itemBloccato && !this.itemPrenotatoInBox) {
            this.selezionato.emit(this.mezzoComp);
            // mappa
            if (!mezzoComposizioneBusy(this.mezzoComp.mezzo.stato)) {
                if (!this.mezzoComp.mezzo.coordinateFake) {
                    this.mezzoDirection(this.mezzoComp);
                }
            }
        } else if (this.selezionato && !this.mezzoComp.istanteScadenzaSelezione && !this.itemBloccato  && !this.itemPrenotatoInBox) {
            this.deselezionato.emit(this.mezzoComp);
        }
    }

    onHoverIn(): void {
        this.hoverIn.emit(this.mezzoComp);
    }

    onHoverOut(): void {
        this.hoverOut.emit(this.mezzoComp);
    }

    onSganciamento(): boolean {
        if (this.sganciamentoDisabilitato) {
            return false;
        }
        if (this.mezzoComp.mezzo && this.mezzoComp.mezzo.idRichiesta) {
            const sganciamentoObj = {} as SganciamentoInterface;
            sganciamentoObj.idMezzoDaSganciare = this.mezzoComp.mezzo.codice;
            sganciamentoObj.idRichiestaDaSganciare = this.mezzoComp.mezzo.idRichiesta;
            sganciamentoObj.descrizione = this.mezzoComp.mezzo.descrizione;
            this.sganciamento.emit(sganciamentoObj);
            // console.log('mezzoComp', this.mezzoComp);
        } else {
            console.error('[SganciamentoMezzo] IdRichiesta non presente nel Mezzo');
        }
    }

    liClass(): string {
        let returnClass = '';

        const hover = this.itemHover ? 'hover-si' : 'hover-no';
        const selezionato = this.itemSelezionato ? 'selezionato-si' : 'selezionato-no';
        const prenotato = (this.itemPrenotato || this.itemPrenotatoInBox) ? 'prenotato-si' : 'prenotato-no';

        switch (hover + '|' + selezionato + '|' + prenotato) {
            case 'hover-si|selezionato-no|prenotato-no':
                returnClass += 'border-warning';
                break;
            case 'hover-no|selezionato-si|prenotato-no':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si|prenotato-no':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-no|selezionato-no|prenotato-si':
                returnClass += 'diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-no|prenotato-si':
                returnClass += 'diagonal-stripes bg-lightgrey';
                break;
            case 'hover-no|selezionato-si|prenotato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si|prenotato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
        }

        if (this.mezzoComp.mezzo.stato !== StatoMezzo.InSede && this.mezzoComp.mezzo.stato !== StatoMezzo.InRientro && this.mezzoComp.mezzo.stato !== StatoMezzo.Rientrato && this.mezzoComp.mezzo.stato !== StatoMezzo.FuoriServizio) {
            returnClass += ' cursor-not-allowed';
            this.itemBloccato = true;
        }

        if (this.itemInPrenotazione) {
            returnClass += ' diagonal-stripes bg-lightgrey';
        }

        if (this.nightMode) {
          returnClass += ' bg-moon-light text-white';
        }

        return returnClass;
    }

    badgeDistaccamentoClass(): string {
        let result = 'badge-mod-secondary';

        if (this.richiesta && this.mezzoComp) {
            const distaccamentoMezzo = this.mezzoComp.mezzo.distaccamento.descrizione;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                this.richiesta.competenze.forEach((competenza: Sede, index: number) => {
                    if (competenza.descrizione === distaccamentoMezzo && index === 0) {
                        result = 'badge-mod-primary';
                    }
                    if (competenza.descrizione === distaccamentoMezzo && index === 1) {
                        result = 'badge-mod-info';
                    }
                });
            }
        }
        return result;
    }

    mezzoDirection(mezzoComp: MezzoComposizione): void {
        const mezzoDirection = {
            idMezzo: mezzoComp.id,
            coordinateMezzo: mezzoComp.mezzo.coordinate
        } as MezzoDirection;
        this.mezzoCoordinate.emit(mezzoDirection);
    }

    _iconaStatiClass(statoMezzo: string): string {
        return iconaStatiClass(statoMezzo);
    }

  getSquadre(richiesta: SintesiRichiesta): string[] {

    // const nomiSquadre: string[] = [];
    const squadre = [];

    if (richiesta.partenzeRichiesta) {
      richiesta.partenzeRichiesta.forEach((partenza: Partenza) => {
        if (partenza.squadre && !partenza.sganciata && !partenza.partenzaAnnullata && !partenza.terminata) {
          partenza.squadre.forEach((squadra: Squadra) => {
            squadre.push({ id: squadra.id, nome: squadra.nome, turno: squadra.turno });
          });
        }
      });
    } else {
      return [];
    }

    function getUnique(arr, comp): any[] {
      return arr.map(e => e[comp]).map((e, i, final) => final.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e]);
    }

    // nomiSquadre.push(...getUnique(squadre, 'id').map((squadra: SquadraPartenza) => squadra.nome));

    return squadre;
  }

}
