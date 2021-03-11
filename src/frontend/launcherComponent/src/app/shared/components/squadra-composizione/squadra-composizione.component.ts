import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { nomeStatiSquadra, squadraComposizioneBusy } from '../../helper/composizione-functions';
import { Sede } from '../../model/sede.model';
import { ViewLayouts } from '../../interface/view.interface';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';

@Component({
    selector: 'app-squadra-composizione',
    templateUrl: './squadra-composizione.component.html',
    styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnDestroy {

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    viewState: ViewLayouts;

    @Input() squadraComp: SquadraComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemPrenotato: boolean;
    @Input() itemBloccato: boolean;
    @Input() nightMode: boolean;

    @Output() selezionata = new EventEmitter<SquadraComposizione>();
    @Output() selezionataInRientro = new EventEmitter<SquadraComposizione>();
    @Output() selezionataPreAccoppiati = new EventEmitter<SquadraComposizione>();
    @Output() deselezionata = new EventEmitter<SquadraComposizione>();
    @Output() deselezionataInRientro = new EventEmitter<SquadraComposizione>();
    @Output() deselezionataPreAccoppiati = new EventEmitter<SquadraComposizione>();
    @Output() hoverIn = new EventEmitter<SquadraComposizione>();
    @Output() hoverOut = new EventEmitter<SquadraComposizione>();
    @Output() sbloccata = new EventEmitter<SquadraComposizione>();

    private subscription = new Subscription();

    constructor() {
        this.getViewState();
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
          if (this.squadraComp.mezzoPreaccoppiato?.mezzo?.stato === 'In Sede') {
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
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
        }

        if (this.squadraComposizioneBusy()) {
            returnClass += ' ';
        }
        return returnClass;
    }

    squadraComposizioneBusy(): boolean {
        if (this.squadraComp?.squadra) {
            return squadraComposizioneBusy(this.squadraComp.squadra.stato);
        } else {
            return true;
        }
    }

    badgeDistaccamentoClass(): string {
        let result = 'badge-mod-secondary';

        if (this.richiesta && this.squadraComp) {
            const distaccamentoSquadra = this.squadraComp.squadra.distaccamento.descrizione;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                this.richiesta.competenze.forEach((competenza: Sede, index: number) => {
                    if (competenza.descrizione === distaccamentoSquadra && index === 0) {
                        result = 'badge-mod-primary';
                    }
                    if (competenza.descrizione === distaccamentoSquadra && index === 1) {
                        result = 'badge-mod-info';
                    }
                });
            }
        }

        return result;
    }
}
