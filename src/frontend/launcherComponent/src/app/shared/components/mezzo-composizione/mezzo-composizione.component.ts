import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { MezzoDirection } from '../../interface/mezzo-direction';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { mezzoComposizioneBusy, nomeStatiSquadra } from '../../helper/composizione-functions';
import { Sede } from '../../model/sede.model';
import { Select } from '@ngxs/store';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable, Subscription } from 'rxjs';
import { ViewLayouts } from '../../interface/view.interface';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit, OnChanges, OnDestroy {

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    viewState: ViewLayouts;

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
    @Output() selezionatoInRientro = new EventEmitter<MezzoComposizione>();
    @Output() selezionatoPreAccoppiati = new EventEmitter<MezzoComposizione>();
    @Output() deselezionato = new EventEmitter<MezzoComposizione>();
    @Output() deselezionatoInRientro = new EventEmitter<MezzoComposizione>();
    @Output() deselezionatoPreAccoppiati = new EventEmitter<MezzoComposizione>();
    @Output() hoverIn = new EventEmitter<MezzoComposizione>();
    @Output() hoverOut = new EventEmitter<MezzoComposizione>();
    @Output() sbloccato = new EventEmitter<MezzoComposizione>();
    @Output() startTimeout = new EventEmitter<MezzoComposizione>();
    @Output() stopTimeout = new EventEmitter<MezzoComposizione>();
    @Output() mezzoCoordinate = new EventEmitter<MezzoDirection>();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();

    sganciamentoDisabilitato = false;
    itemPrenotatoInBox = false;

    private subscription = new Subscription();

    constructor() {
        this.getViewState();
    }

    ngOnInit(): void {
        this.sganciamentoCheck();
        this.mezzoInPartenzaCheck();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const boxPartenzaList = changes?.boxPartenzaList;
        if (boxPartenzaList?.currentValue && boxPartenzaList?.previousValue && this.boxPartenzaList?.length && (boxPartenzaList?.currentValue?.length !== boxPartenzaList?.previousValue?.length)) {
            let shouldSkip = true;
            boxPartenzaList?.currentValue.forEach(x => (!x.mezzoComp && x.squadreComposizione?.length) ? shouldSkip = false : null);
            if (shouldSkip) {
                return;
            }
            boxPartenzaList?.currentValue.forEach(x => x.mezzoComposizione && (x.mezzoComposizione?.id !== this.mezzoComp?.id) ? this.itemPrenotatoInBox = false : null);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    mezzoInPartenzaCheck(): void {
        if (this.mezzoComp && this.mezzoComp.id && this.boxPartenzaList && this.boxPartenzaList.length > 1) {
            this.boxPartenzaList.forEach((x, i) => x.mezzoComposizione && (x.mezzoComposizione.id === this.mezzoComp.id) && this.boxPartenzaList[i + 1] ? this.itemPrenotatoInBox = true : null);
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

    _nomeStatiSquadra(statoSquadra: number): string {
      return nomeStatiSquadra(statoSquadra);
    }

    onClick(inRientro?: boolean, preAccoppiato?: boolean): void {
        // if (this.itemBloccato) {
        //     this.onSganciamento();
        // }
        if (this.mezzoComp.mezzo.stato === 'In Viaggio' || this.mezzoComp.mezzo.stato === 'Sul Posto') {
          this.onSganciamento();
        } else {
            if (!mezzoComposizioneBusy(this.mezzoComp.mezzo.stato) && !inRientro && !preAccoppiato) {
                if (!this.itemSelezionato && !this.mezzoComp.istanteScadenzaSelezione && !this.itemPrenotatoInBox) {
                    this.selezionato.emit(this.mezzoComp);
                } else if (this.itemSelezionato && !this.mezzoComp.istanteScadenzaSelezione && !this.itemPrenotatoInBox) {
                    this.deselezionato.emit(this.mezzoComp);
                }
                // mappa
                if (!this.mezzoComp.mezzo.coordinateFake) {
                    this.mezzoDirection(this.mezzoComp);
                }
            } else if (inRientro) {
                if (!this.itemSelezionato && !this.mezzoComp.istanteScadenzaSelezione && !this.itemPrenotatoInBox) {
                    this.selezionatoInRientro.emit(this.mezzoComp);
                } else {
                    this.deselezionatoInRientro.emit(this.mezzoComp);
                }
                // mappa
                if (!this.mezzoComp.mezzo.coordinateFake) {
                    this.mezzoDirection(this.mezzoComp);
                }
            } else if (preAccoppiato && !mezzoComposizioneBusy(this.mezzoComp.mezzo.stato)) {
              let skip = false;
              this.mezzoComp.squadrePreaccoppiate.forEach(x => this._nomeStatiSquadra(x.squadra.stato) !== 'In Sede' ? skip = true : null);
              if (!skip) {
                if (!this.itemSelezionato && !this.mezzoComp.istanteScadenzaSelezione && !this.itemPrenotatoInBox) {
                  this.selezionatoPreAccoppiati.emit(this.mezzoComp);
                } else {
                  this.deselezionatoPreAccoppiati.emit(this.mezzoComp);
                }
                // mappa
                if (!this.mezzoComp.mezzo.coordinateFake) {
                  this.mezzoDirection(this.mezzoComp);
                }
              }
            }
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

        if (mezzoComposizioneBusy(this.mezzoComp.mezzo.stato)) {
            returnClass += ' ';
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
}
