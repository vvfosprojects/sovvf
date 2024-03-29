import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { BoxPartenza, BoxPartenzaPreAccoppiati } from '../../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { Select, Store } from '@ngxs/store';
import { checkSquadraOccupata, iconaStatiClass, nomeStatiSquadra } from '../../../../../shared/helper/function-composizione';
import { BoxPartenzaHover } from '../../interface/composizione/box-partenza-hover-interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { Observable, Subscription } from 'rxjs';
import { BoxPartenzaState } from '../../../store/states/composizione-partenza/box-partenza.state';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';
import { TipoConcorrenzaEnum } from '../../../../../shared/enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../../../core/service/concorrenza-service/locked-concorrenza.service';

@Component({
    selector: 'app-box-preaccoppiato',
    templateUrl: './box-preaccoppiato.component.html',
    styleUrls: ['./box-preaccoppiato.component.css']
})
export class BoxPreaccoppiatoComponent implements OnChanges, OnDestroy {

    // BoxPartenza Composizione
    @Select(BoxPartenzaState.boxPartenzaList) boxPartenzaList$: Observable<BoxPartenza[]>;
    boxPartenzaList: BoxPartenza[];

    @Select(BoxPartenzaState.disableNuovaPartenza) disableNuovaPartenza$: Observable<boolean>;

    @Input() partenzaPreAccopiati: BoxPartenzaPreAccoppiati;
    @Input() richiesta: SintesiRichiesta;
    @Input() compPartenzaMode: Composizione;
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemOccupato: boolean;
    @Input() nightMode: boolean;
    @Input() disableDividi: boolean;

    // Options
    @Input() elimina: boolean;
    @Input() alert: boolean;

    @Output() selezionato = new EventEmitter<BoxPartenzaPreAccoppiati>();
    @Output() deselezionato = new EventEmitter<BoxPartenzaPreAccoppiati>();
    @Output() eliminato = new EventEmitter<BoxPartenzaPreAccoppiati>();
    @Output() squadraShortcut = new EventEmitter<SquadraComposizione>();

    @Output() hoverIn = new EventEmitter<BoxPartenzaHover>();
    @Output() hoverOut = new EventEmitter();

    itemBloccato: boolean;
    StatoMezzo = StatoMezzo;
    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    idSquadre: string[];

    private subscription = new Subscription();

    constructor(private store: Store,
                private lockedConcorrenzaService: LockedConcorrenzaService) {
        // Prendo i box partenza
        this.getBoxPartenzaList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.partenzaPreAccopiati?.currentValue) {
            const partenzaPreAccopiati = changes?.partenzaPreAccopiati?.currentValue;
            this.idSquadre = partenzaPreAccopiati.squadre.map((sC: SquadraComposizione) => sC.idSquadra);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getBoxPartenzaList(): void {
        this.subscription.add(
            this.boxPartenzaList$.subscribe((boxPartenza: BoxPartenza[]) => {
                this.boxPartenzaList = boxPartenza;
            })
        );
    }

    onClick(): void {
        if (!this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Mezzo, [this.partenzaPreAccopiati.codiceMezzo]) && !this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Squadra, this.idSquadre)) {
            if (!this.itemOccupato) {
                if (!this.itemSelezionato) {
                    this.selezionato.emit(this.partenzaPreAccopiati);
                } else {
                    this.deselezionato.emit(this.partenzaPreAccopiati);
                }
            }
        }
    }

    onElimina(e: MouseEvent): void {
        e.stopPropagation();
        this.eliminato.emit(this.partenzaPreAccopiati);
    }

    ngClass(): string {
        let returnClass: string;

        if (this.compPartenzaMode === Composizione.Veloce) {
            /* Se è attiva la modalità rapida */
            returnClass = this.itemSelezionato ? 'bg-light card-shadow-success' : 'card-shadow';

            if (this.itemOccupato) {
                returnClass += ' diagonal-stripes bg-lightdanger cursor-not-allowed';
                this.itemBloccato = true;
            } else if (!this.itemSelezionato) {
                returnClass += this.itemHover ? ' border-warning' : '';
            }
        } else if (this.compPartenzaMode === Composizione.Avanzata) {
            /* Se è attiva la modalità avanzata */
            if (this.itemSelezionato) {
                const squadra = this.partenzaPreAccopiati.squadre.length > 0 ? 'squadra-si' : 'squadra-no';
                const mezzo = this.partenzaPreAccopiati.codiceMezzo ? 'mezzo-si' : 'mezzo-no';

                if (!this.nightMode) {
                    returnClass = 'bg-light ';
                } else {
                    returnClass = 'bg-dark ';
                }

                switch (mezzo + '|' + squadra) {
                    case 'mezzo-si|squadra-no':
                        returnClass += 'border-danger card-shadow-danger';
                        break;
                    case 'mezzo-no|squadra-no':
                        returnClass += 'border-danger card-shadow-danger';
                        break;
                    case 'mezzo-si|squadra-si':
                        returnClass += 'border-success card-shadow-success';
                        break;
                    case 'mezzo-no|squadra-si':
                        returnClass += 'border-warning card-shadow-warning';
                        break;
                }
            } else if (!this.itemSelezionato) {
                returnClass = 'card-shadow';
            }
        }

        return returnClass;
    }

    badgeDistaccamentoClass(): string {
        let result = 'badge-terza-competenza';

        if (this.richiesta && this.partenzaPreAccopiati.codiceMezzo) {
            const distaccamentoMezzo = this.partenzaPreAccopiati.distaccamento;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
                    result = 'badge-prima-competenza';
                } else if (this.richiesta.competenze.length > 0 && this.richiesta.competenze[1] && this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
                    result = 'badge-seconda-competenza';
                }
            }
        }

        return result;
    }

    boxValidationClass(): { result: string, tooltip: string } {
        let result = 'text-danger';
        let tooltip = 'Errore sconosciuto';
        const prefix = 'fa ';
        let icon = 'fa-exclamation-triangle';
        const squadra2 = this.partenzaPreAccopiati.squadre.length ? 'squadra-si' : 'squadra-no';
        const mezzo2 = this.partenzaPreAccopiati.codiceMezzo && this.partenzaPreAccopiati.statoMezzo === StatoMezzo.InSede ? 'mezzo-si' : 'mezzo-no';

        switch (mezzo2 + '|' + squadra2) {
            case 'mezzo-si|squadra-no':
                tooltip = 'È necessario selezionare una squadra';
                break;
            case 'mezzo-no|squadra-no':
                tooltip = 'È necessario selezionare un mezzo o una squadra';
                break;
            case 'mezzo-si|squadra-si':
                result = 'text-success';
                tooltip = 'Tutto ok';
                icon = 'fa-check';
                break;
            case 'mezzo-no|squadra-si':
                result = 'text-warning';
                tooltip = 'È necessario selezionare un mezzo';
                break;
        }

        return { result: result + ' ' + prefix + icon, tooltip };
    }

    _checkSquadraOccupata(squadreComposizione: SquadraComposizione[]): boolean {
        return checkSquadraOccupata(squadreComposizione);
    }

    onHoverIn(): void {
        if (this.compPartenzaMode === Composizione.Veloce) {
            this.hoverIn.emit({
                idBoxPartenza: this.partenzaPreAccopiati.id,
                idMezzo: this.partenzaPreAccopiati.codiceMezzo,
            });
        }
    }

    onHoverOut(): void {
        if (this.compPartenzaMode === Composizione.Veloce) {
            this.hoverOut.emit();
        }
    }

    squadraShortcutEvent(): void {
        this.squadraShortcut.emit(this.partenzaPreAccopiati.squadre[0]);
    }

    _iconaStatiClass(statoMezzo: any): string {
        return iconaStatiClass(statoMezzo);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

    isLockedConcorrenza(): string {
        const isLockedMezzo = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Mezzo, [this.partenzaPreAccopiati.codiceMezzo]);
        const isLockedSquadra = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.Squadra, this.idSquadre);

        if (isLockedMezzo && isLockedSquadra) {
            return isLockedMezzo;
        } else if (isLockedMezzo) {
            return isLockedMezzo;
        } else if (isLockedSquadra) {
            return isLockedSquadra;
        }
    }
}
