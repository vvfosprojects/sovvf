import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BoxPartenza } from '../../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { Select, Store } from '@ngxs/store';
import { ShowToastr } from 'src/app/shared/store/actions/toastr/toastr.actions';
import { ToastrType } from 'src/app/shared/enum/toastr';
import { checkSquadraOccupata, iconaStatiClass, mezzoComposizioneBusy, nomeStatiSquadra } from '../../../../../shared/helper/function-composizione';
import { BoxPartenzaHover } from '../../interface/composizione/box-partenza-hover-interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { Observable, Subscription } from 'rxjs';
import { BoxPartenzaState } from '../../../store/states/composizione-partenza/box-partenza.state';
import { SquadraComposizione } from '../../../../../shared/interface/squadra-composizione-interface';
import { makeCopy } from '../../../../../shared/helper/function-generiche';

@Component({
    selector: 'app-box-nuova-partenza',
    templateUrl: './box-nuova-partenza.component.html',
    styleUrls: ['./box-nuova-partenza.component.css']
})
export class BoxNuovaPartenzaComponent implements OnDestroy, OnInit {

    // BoxPartenza Composizione
    @Select(BoxPartenzaState.boxPartenzaList) boxPartenzaList$: Observable<BoxPartenza[]>;
    boxPartenzaList: BoxPartenza[];

    @Select(BoxPartenzaState.disableNuovaPartenza) disableNuovaPartenza$: Observable<boolean>;

    @Input() partenza: BoxPartenza;
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

    @Output() selezionato = new EventEmitter<any>();
    @Output() deselezionato = new EventEmitter<any>();
    @Output() eliminato = new EventEmitter<BoxPartenza>();
    @Output() squadraShortcut = new EventEmitter<SquadraComposizione>();

    @Output() hoverIn = new EventEmitter<BoxPartenzaHover>();
    @Output() hoverOut = new EventEmitter();

    itemBloccato: boolean;
    StatoMezzo = StatoMezzo;
    nuovaPartenza: BoxPartenza;

    private subscription = new Subscription();


    constructor(private store: Store) {
        // Prendo i box partenza
        this.subscription.add(
            this.boxPartenzaList$.subscribe((boxPartenza: BoxPartenza[]) => {
                this.boxPartenzaList = boxPartenza;
            })
        );
    }

    ngOnInit(): void {
        this.nuovaPartenza = makeCopy(this.partenza);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onClick(): void {
        if (!this.itemOccupato) {
            if (!this.itemSelezionato) {
                this.selezionato.emit(this.partenza);
            } else {
                this.deselezionato.emit(this.partenza);
            }
        } else if (mezzoComposizioneBusy(this.partenza.mezzoComposizione.mezzo.stato)) {
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il Preaccopiato', 'Il mezzo è ' + this.partenza.mezzoComposizione.mezzo.stato + ' ed è impegnato in un\'altra richiesta', null, null, true));
        } else if (this._checkSquadraOccupata(this.partenza.squadreComposizione)) {
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il Preaccopiato', 'Una o più squadre del Preaccopiato risultano impegnate in un\'altra richiesta', null, null, true));
        }
    }

    onElimina(e: MouseEvent): void {
        e.stopPropagation();
        this.eliminato.emit(this.partenza);
    }

    ngClass(): string {
        let returnClass: string;

        if (this.compPartenzaMode === Composizione.Veloce) {
            /* Se è attiva la modalità rapida */
            returnClass = this.itemSelezionato ? 'bg-light card-shadow-success' : 'card-shadow';

            if (this.itemOccupato) {
                returnClass += ' diagonal-stripes bg-lightdanger';
                this.itemBloccato = true;
            } else if (!this.itemSelezionato) {
                returnClass += this.itemHover ? ' border-warning' : '';
            }
        } else if (this.compPartenzaMode === Composizione.Avanzata) {
            /* Se è attiva la modalità avanzata */
            if (this.itemSelezionato) {
                const squadra = this.partenza.squadreComposizione.length > 0 ? 'squadra-si' : 'squadra-no';
                const mezzo = this.partenza.mezzoComposizione ? 'mezzo-si' : 'mezzo-no';

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

        if (this.richiesta && this.partenza.mezzoComposizione) {
            const distaccamentoMezzo = this.partenza.mezzoComposizione.mezzo.distaccamento.descrizione;

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
        const prefix = 'fas ';
        let icon = 'fa-exclamation-triangle';
        const partenza = this.partenza as any;
        const squadra2 = partenza.squadreComposizione?.length ? 'squadra-si' : 'squadra-no';
        let mezzo2;
        if (partenza.mezzoComposizione && partenza.mezzoComposizione.mezzo) {
            mezzo2 = partenza.mezzoComposizione && (partenza.mezzoComposizione.mezzo.stato === StatoMezzo.InSede || partenza.mezzoComposizione.mezzo.stato === StatoMezzo.InRientro) ? 'mezzo-si' : 'mezzo-no';
        } else if (partenza.mezzoComposizione && !partenza.mezzoComposizione.mezzo) {
            mezzo2 = partenza.mezzoComposizione.stato === StatoMezzo.InSede || partenza.mezzoComposizione.stato === StatoMezzo.InRientro ? 'mezzo-si' : 'mezzo-no';
        }

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
                idBoxPartenza: this.partenza.id,
                idMezzo: this.partenza.mezzoComposizione.mezzo ? this.partenza.mezzoComposizione.mezzo.codice : null,
            });
        }
    }

    onHoverOut(): void {
        if (this.compPartenzaMode === Composizione.Veloce) {
            this.hoverOut.emit();
        }
    }

    squadraShortcutEvent(): void {
        this.squadraShortcut.emit(this.partenza.squadreComposizione[0]);
    }

    _iconaStatiClass(statoMezzo: any): string {
        return iconaStatiClass(statoMezzo);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }

}
