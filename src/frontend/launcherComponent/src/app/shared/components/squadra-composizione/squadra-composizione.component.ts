import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { nomeStatiSquadra, squadraComposizioneBusy } from '../../helper/function-composizione';
import { Sede } from '../../model/sede.model';
import { ViewLayouts } from '../../interface/view.interface';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-squadra-composizione',
    templateUrl: './squadra-composizione.component.html',
    styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnDestroy, OnChanges, OnInit {

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    viewState: ViewLayouts;

    @Input() squadraComposizione: SquadraComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemPrenotato: boolean;
    @Input() itemBloccato: boolean;
    @Input() nightMode: boolean;
    @Input() loadingMezzi: boolean;
    @Input() boxPartenzaList: BoxPartenza[];

    @Output() selezionata = new EventEmitter<SquadraComposizione>();
    @Output() selezionataInRientro = new EventEmitter<SquadraComposizione>();
    @Output() selezionataPreAccoppiati = new EventEmitter<SquadraComposizione>();
    @Output() deselezionata = new EventEmitter<SquadraComposizione>();
    @Output() deselezionataInRientro = new EventEmitter<SquadraComposizione>();
    @Output() deselezionataPreAccoppiati = new EventEmitter<SquadraComposizione>();
    @Output() hoverIn = new EventEmitter<SquadraComposizione>();
    @Output() hoverOut = new EventEmitter<SquadraComposizione>();
    @Output() sbloccata = new EventEmitter<SquadraComposizione>();

    disableBtnFeature = false;
    autistaInSquadra = false;

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    private subscription = new Subscription();

    constructor() {
        this.getViewState();
    }

    ngOnInit(): void {
        this.checkAutista();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const boxPartenzaList = changes?.boxPartenzaList;
        if (boxPartenzaList?.currentValue && this.squadraComposizione?.mezziInRientro?.length) {
            const boxesPartenza = boxPartenzaList.currentValue;
            this.disableButtonMezziInRientroBusy(boxesPartenza);
        }
        if (boxPartenzaList?.currentValue && this.squadraComposizione?.mezziPreaccoppiati?.length) {
            const boxesPartenza = boxPartenzaList.currentValue;
            this.disableButtonMezziPreaccoppiatiBusy(boxesPartenza);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    disableButtonMezziPreaccoppiatiBusy(boxPartenzaList: BoxPartenza[]): void {
        boxPartenzaList.forEach(x => x.mezzoComposizione?.id === this.squadraComposizione.mezziPreaccoppiati[0].mezzo.codice ? this.disableBtnFeature = true : null);
    }

    disableButtonMezziInRientroBusy(boxPartenzaList: BoxPartenza[]): void {
        boxPartenzaList.forEach(x => x.mezzoComposizione?.id === this.squadraComposizione.mezziInRientro[0].id ? this.disableBtnFeature = true : null);
    }

    onClick(inRientro?: boolean, preAccoppiato?: boolean): void {
        if (!this.loadingMezzi) {
            if (!this.squadraComposizioneBusy() && !inRientro && !preAccoppiato) {
                if (!this.itemSelezionato) {
                    this.selezionata.emit(this.squadraComposizione);
                } else {
                    this.deselezionata.emit(this.squadraComposizione);
                }
            } else if (inRientro) {
                if (!this.itemSelezionato) {
                    this.selezionataInRientro.emit(this.squadraComposizione);
                } else {
                    this.deselezionataInRientro.emit(this.squadraComposizione);
                }
            } else if (preAccoppiato && !this.squadraComposizioneBusy()) {
                if (this.squadraComposizione.mezziPreaccoppiati[0]?.mezzo.stato === 'In Sede') {
                    if (!this.itemSelezionato) {
                        this.selezionataPreAccoppiati.emit(this.squadraComposizione);
                    } else {
                        this.deselezionataPreAccoppiati.emit(this.squadraComposizione);
                    }
                }
            }
        }
    }

    onHoverIn(): void {
        this.hoverIn.emit(this.squadraComposizione);
    }

    onHoverOut(): void {
        this.hoverOut.emit(this.squadraComposizione);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

    liClass(): string {
        let returnClass = '';

        const hover = this.itemHover ? 'hover-si' : 'hover-no';
        const selezionato = this.itemSelezionato ? 'selezionato-si' : 'selezionato-no';

        switch (hover + '|' + selezionato) {
            case 'hover-si|selezionato-no':
                returnClass += 'border-warning';
                break;
            case 'hover-no|selezionato-si':
                returnClass += 'border-danger selected-composizione';
                break;
            case 'hover-si|selezionato-si':
                returnClass += 'border-danger selected-composizione';
                break;
        }

        if (this.squadraComposizioneBusy()) {
            returnClass += ' ';
        }
        return returnClass;
    }

    squadraComposizioneBusy(): boolean {
        if (this.squadraComposizione) {
            return squadraComposizioneBusy(this.squadraComposizione.stato);
        } else {
            return true;
        }
    }

    badgeDistaccamentoClass(): string {
        let result = 'badge-terza-competenza';

        if (this.richiesta && this.squadraComposizione && this.squadraComposizione.distaccamento) {
            const distaccamentoSquadra = this.squadraComposizione.distaccamento.descrizione.replace(/\s+/g, ' ').trim();

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                this.richiesta.competenze.forEach((competenza: Sede, index: number) => {
                    if (competenza.descrizione === distaccamentoSquadra && index === 0) {
                        result = 'badge-prima-competenza';
                    }
                    if (competenza.descrizione === distaccamentoSquadra && index === 1) {
                        result = 'badge-seconda-competenza';
                    }
                });
            }
        }

        return result;
    }

    checkAutista(): void {
        if (this.squadraComposizione) {
            this.squadraComposizione.membri.forEach(x => x.autista ? this.autistaInSquadra = true : null);
        }
    }
}
