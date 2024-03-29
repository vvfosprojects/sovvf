import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { MezzoDirection } from '../../interface/mezzo-direction';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { mezzoComposizioneBusy, nomeStatiSquadra } from '../../helper/function-composizione';
import { Sede } from '../../model/sede.model';
import { Select } from '@ngxs/store';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { Observable, Subscription } from 'rxjs';
import { ViewLayouts } from '../../interface/view.interface';
import { Coordinate } from '../../model/coordinate.model';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../core/service/concorrenza-service/locked-concorrenza.service';
import { Partenza } from '../../model/partenza.model';

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
    @Input() loadingSquadre: boolean;
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
    @Output() mezzoCoordinate = new EventEmitter<MezzoDirection>();
    @Output() mezzoCoordinateClear = new EventEmitter<MezzoDirection>();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();

    sganciamentoDisabilitato: boolean;
    itemPrenotatoInBox: boolean;
    disableBtnFeature: boolean;

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;
    statoMezzo = StatoMezzo;

    private subscription = new Subscription();

    constructor(private lockedConcorrenzaService: LockedConcorrenzaService) {
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
        if (boxPartenzaList?.currentValue && this.mezzoComp && (this.mezzoComp.listaSquadre || this.mezzoComp.squadrePreaccoppiate)) {
            boxPartenzaList?.currentValue.forEach(x => x.mezzoComposizione && (x.mezzoComposizione.id === this.mezzoComp?.id) ? this.disableBtnFeature = true : null);
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
        if (this.richiesta && this.richiesta.partenze && this.richiesta.partenze.length > 0) {
            this.sganciamentoDisabilitato = !!this.richiesta.partenze.find(e => {
                return e.partenza.mezzo.descrizione === this.mezzoComp.mezzo.descrizione &&
                    !e.partenza.sganciata && !e.partenza.terminata && !e.partenza.partenzaAnnullata;
            });
        }
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

    onClick(inRientro?: boolean, preAccoppiato?: boolean): void {
        if (!this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Mezzo, [this.mezzoComp.mezzo.codice])) {
            if (!this.loadingSquadre) {
                if (this.mezzoComp.mezzo.stato === StatoMezzo.InViaggio || this.mezzoComp.mezzo.stato === StatoMezzo.SulPosto) {
                    this.onSganciamento();
                } else {
                    if (!mezzoComposizioneBusy(this.mezzoComp.mezzo.stato) && !inRientro && !preAccoppiato) {
                        if (!this.itemSelezionato && !this.itemPrenotatoInBox) {
                            this.selezionato.emit(this.mezzoComp);
                            // mappa
                            if (!this.mezzoComp.mezzo.coordinateFake) {
                                this.mezzoDirection(this.mezzoComp);
                            } else {
                                this.mezzoDirectionClear(this.mezzoComp);
                            }
                        } else if (this.itemSelezionato && !this.itemPrenotatoInBox) {
                            this.deselezionato.emit(this.mezzoComp);
                        }
                    } else if (inRientro) {
                        if (!this.itemSelezionato && !this.itemPrenotatoInBox) {
                            this.selezionatoInRientro.emit(this.mezzoComp);
                            // mappa
                            if (!this.mezzoComp.mezzo.coordinateFake) {
                                this.mezzoDirection(this.mezzoComp);
                            } else {
                                this.mezzoDirectionClear(this.mezzoComp);
                            }
                        } else {
                            this.deselezionatoInRientro.emit(this.mezzoComp);
                        }
                    } else if (preAccoppiato && !mezzoComposizioneBusy(this.mezzoComp.mezzo.stato)) {
                        let skip = false;
                        this.mezzoComp.squadrePreaccoppiate.forEach(x => this._nomeStatiSquadra(x.stato) !== StatoMezzo.InSede ? skip = true : null);
                        if (!skip) {
                            if (!this.itemSelezionato && !this.itemPrenotatoInBox) {
                                this.selezionatoPreAccoppiati.emit(this.mezzoComp);
                                // mappa
                                if (!this.mezzoComp.mezzo.coordinateFake) {
                                    this.mezzoDirection(this.mezzoComp);
                                } else {
                                    this.mezzoDirectionClear(this.mezzoComp);
                                }
                            } else {
                                this.deselezionatoPreAccoppiati.emit(this.mezzoComp);
                            }
                        }
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
                returnClass += 'border-danger selected-composizione';
                break;
            case 'hover-si|selezionato-si|prenotato-no':
                returnClass += 'border-danger selected-composizione';
                break;
            case 'hover-no|selezionato-no|prenotato-si':
                returnClass += 'selected-composizione';
                break;
            case 'hover-si|selezionato-no|prenotato-si':
                returnClass += 'selected-composizione';
                break;
            case 'hover-no|selezionato-si|prenotato-si':
                returnClass += 'border-danger selected-composizione';
                break;
            case 'hover-si|selezionato-si|prenotato-si':
                returnClass += 'border-danger selected-composizione';
                break;
        }

        if (mezzoComposizioneBusy(this.mezzoComp.mezzo.stato)) {
            returnClass += ' ';
        }

        if (this.itemInPrenotazione) {
            returnClass += ' selected-composizione';
        }

        if (this.nightMode) {
            returnClass += ' bg-moon-light text-white';
        }

        return returnClass;
    }

    badgeDistaccamentoClass(): string {
        let result = 'badge-terza-competenza';

        if (this.richiesta && this.mezzoComp) {
            const distaccamentoMezzo = this.mezzoComp.mezzo.distaccamento.descrizione;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                this.richiesta.competenze.forEach((competenza: Sede, index: number) => {
                    if (competenza.descrizione === distaccamentoMezzo && index === 0) {
                        result = 'badge-prima-competenza';
                    }
                    if (competenza.descrizione === distaccamentoMezzo && index === 1) {
                        result = 'badge-seconda-competenza';
                    }
                });
            }
        }
        return result;
    }

    getPartenzaMezzoInRichiestaComposizione(): boolean {
        const partenza = this.richiesta.partenze.filter((p: Partenza) => p.mezzo.codice === this.mezzoComp.mezzo.codice && !p.partenza.terminata && !p.partenza.partenzaAnnullata && !p.partenza.sganciata)[0];
        return !!partenza;
    }

    getButtonPreaccoppiatoDisabled(): boolean {
        // tslint:disable-next-line:max-line-length
        return this.disableBtnFeature || this.loadingSquadre || this.itemSelezionato || this.boxPartenzaList[this.boxPartenzaList?.length - 1]?.squadreComposizione?.length > 0 || !!(this.boxPartenzaList[this.boxPartenzaList?.length - 1]?.mezzoComposizione) || !!(this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Squadra, [this.mezzoComp.squadrePreaccoppiate[0].idSquadra]));
    }

    mezzoDirection(mezzoComp: MezzoComposizione): void {
        const lat = mezzoComp.mezzo.coordinateStrg?.length > 0 ? +mezzoComp.mezzo.coordinateStrg[0] : null;
        const lon = mezzoComp.mezzo.coordinateStrg?.length > 1 ? +mezzoComp.mezzo.coordinateStrg[1] : null;
        if (lat && lon) {
            const mezzoDirection = {
                idMezzo: mezzoComp.id,
                coordinateMezzo: new Coordinate(lat, lon),
                genereMezzo: mezzoComp.mezzo.genere
            } as MezzoDirection;
            this.mezzoCoordinate.emit(mezzoDirection);
        } else {
            console.error('CoordinateStrg non presenti nel mezzo');
        }
    }

    mezzoDirectionClear(mezzoComp: MezzoComposizione): void {
        const mezzoDirection = {
            idMezzo: mezzoComp.id,
            coordinateMezzo: mezzoComp.mezzo.coordinate,
            genereMezzo: mezzoComp.mezzo.genere
        } as MezzoDirection;
        this.mezzoCoordinateClear.emit(mezzoDirection);
    }
}
