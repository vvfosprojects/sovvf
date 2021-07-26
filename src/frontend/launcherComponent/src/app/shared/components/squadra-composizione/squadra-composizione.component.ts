import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { nomeStatiSquadra, squadraComposizioneBusy } from '../../helper/function-composizione';
import { Sede } from '../../model/sede.model';
import { ViewLayouts } from '../../interface/view.interface';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import {BoxPartenza} from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { makeCopy } from '../../helper/function-generiche';

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
    private subscription = new Subscription();
    squadraComp: any;

    constructor() {
        this.getViewState();
    }

    ngOnInit(): void {
        // TODO: RIVEDERE LOGICA PER DIVERSO MODELLO DATI BE
        this.squadraComp = makeCopy(this.squadraComposizione);
        if (this.squadraComposizione && this.squadraComposizione.mezziPreaccoppiati) {
            this.squadraComp.mezziPreaccoppiati.forEach((x, i) => x.mezzo = makeCopy(this.squadraComposizione.mezziPreaccoppiati[i]));
            this.squadraComp.mezziPreaccoppiati.forEach(x => x.mezzo.distaccamento = { descrizione: x.mezzo.distaccamento });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
      const boxPartenzaList = changes?.boxPartenzaList;
      if (boxPartenzaList?.currentValue && this.squadraComp &&  this.squadraComp.listaMezzi) {
        boxPartenzaList?.currentValue.forEach(x =>  x.mezzoComposizione && (x.mezzoComposizione.id === this.squadraComp.listaMezzi[0].id) ? this.disableBtnFeature = true : null);
      }
      if (boxPartenzaList?.currentValue && this.squadraComp && this.squadraComp.mezziPreaccoppiati && this.squadraComp.mezziPreaccoppiati.length) {
        boxPartenzaList?.currentValue.forEach(x =>  x.mezzoComposizione && (x.mezzoComposizione.id === this.squadraComp.mezziPreaccoppiati[0].mezzo.codice) ? this.disableBtnFeature = true : null);
      }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    onClick(inRientro?: boolean, preAccoppiato?: boolean): void {
        if (!this.squadraComposizioneBusy() && !inRientro && !preAccoppiato) {
            if (!this.itemSelezionato) {
                this.selezionata.emit(this.squadraComp);
            } else {
                this.deselezionata.emit(this.squadraComp);
            }
        } else if (inRientro) {
            if (!this.itemSelezionato) {
              this.selezionataInRientro.emit(this.squadraComp);
            } else {
              this.deselezionataInRientro.emit(this.squadraComp);
            }
        } else if (preAccoppiato && !this.squadraComposizioneBusy()) {
          if (this.squadraComp.mezziPreaccoppiati[0]?.mezzo.stato === 'In Sede') {
            if (!this.itemSelezionato) {
              this.selezionataPreAccoppiati.emit(this.squadraComp);
            } else {
              this.deselezionataPreAccoppiati.emit(this.squadraComp);
            }
          }
        }
    }

    onHoverIn(): void {
        this.hoverIn.emit(this.squadraComp);
    }

    onHoverOut(): void {
        this.hoverOut.emit(this.squadraComp);
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
        if (this.squadraComp) {
            return squadraComposizioneBusy(this.squadraComp.stato);
        } else {
            return true;
        }
    }

    badgeDistaccamentoClass(): string {
        let result = 'badge-terza-competenza';

        if (this.richiesta && this.squadraComp && this.squadraComp) {
            const distaccamentoSquadra = this.squadraComp.distaccamento.descrizione.replace(/\s+/g, ' ').trim();

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
}
