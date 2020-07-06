import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BoxPartenza } from '../../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import { RequestResetBookMezzoComposizione } from '../../../store/actions/composizione-partenza/mezzi-composizione.actions';
import { Store } from '@ngxs/store';
import { ShowToastr } from 'src/app/shared/store/actions/toastr/toastr.actions';
import { ToastrType } from 'src/app/shared/enum/toastr';
import {
    checkSquadraOccupata,
    iconaStatiClass,
    mezzoComposizioneBusy
} from '../functions/composizione-functions';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { BoxPartenzaHover } from '../../interface/composizione/box-partenza-hover-interface';

@Component({
    selector: 'app-box-nuova-partenza',
    templateUrl: './box-nuova-partenza.component.html',
    styleUrls: ['./box-nuova-partenza.component.css']
})
export class BoxNuovaPartenzaComponent {
    @Input() partenza: BoxPartenza;
    @Input() richiesta: SintesiRichiesta;
    @Input() compPartenzaMode: Composizione;
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemOccupato: boolean;

    // Options
    @Input() elimina: boolean;
    @Input() alert: boolean;

    @Output() selezionato = new EventEmitter<BoxPartenza>();
    @Output() deselezionato = new EventEmitter<BoxPartenza>();
    @Output() eliminato = new EventEmitter<BoxPartenza>();

    @Output() hoverIn = new EventEmitter<BoxPartenzaHover>();
    @Output() hoverOut = new EventEmitter();

    itemBloccato: boolean;

    constructor(private store: Store) {
    }

    onClick() {
        if (!this.itemOccupato) {
            if (!this.itemSelezionato) {
                this.selezionato.emit(this.partenza);
            } else {
                this.deselezionato.emit(this.partenza);
            }
        } else if (mezzoComposizioneBusy(this.partenza.mezzoComposizione.mezzo.stato)) {
            // tslint:disable-next-line:max-line-length
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il Preaccopiato', 'Il mezzo è ' + this.partenza.mezzoComposizione.mezzo.stato + ' ed è impegnato in un\'altra richiesta', null, null, true));
        } else if (this._checkSquadraOccupata(this.partenza.squadraComposizione)) {
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il Preaccopiato', 'Una o più squadre del Preaccopiato risultano impegnate in un\'altra richiesta', null, null, true));
        }
    }

    onElimina(e: MouseEvent) {
        e.stopPropagation();
        this.eliminato.emit(this.partenza);
    }

    ngClass() {
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

            if (this.partenza.mezzoComposizione.istanteScadenzaSelezione) {
                returnClass += ' diagonal-stripes bg-lightgrey';
            }

        } else if (this.compPartenzaMode === Composizione.Avanzata) {
            /* Se è attiva la modalità avanzata */
            if (this.itemSelezionato) {
                const squadra = this.partenza.squadraComposizione.length > 0 ? 'squadra-si' : 'squadra-no';
                const mezzo = this.partenza.mezzoComposizione ? 'mezzo-si' : 'mezzo-no';

                returnClass = 'bg-light ';

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

    badgeDistaccamentoClass() {
        let result = 'badge-secondary';

        if (this.richiesta && this.partenza.mezzoComposizione) {
            const distaccamentoMezzo = this.partenza.mezzoComposizione.mezzo.distaccamento.descrizione;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
                    result = 'badge-primary';
                } else if ( this.richiesta.competenze.length > 0 && this.richiesta.competenze[1] && this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
                    result = 'badge-info';
                }
            }
        }

        return result;
    }

    boxValidationClass() {
        let result = 'text-danger';
        let tooltip = 'Errore sconosciuto';
        const prefix = 'fa ';
        let icon = 'fa-exclamation-triangle';
        const squadra2 = this.partenza.squadraComposizione.length > 0 ? 'squadra-si' : 'squadra-no';
        const mezzo2 = this.partenza.mezzoComposizione ? 'mezzo-si' : 'mezzo-no';

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

        return { result: result + ' ' + prefix + icon, tooltip: tooltip };
    }

    onResetTimeout(e: MouseEvent) {
        e.stopPropagation();
        this.store.dispatch(new RequestResetBookMezzoComposizione(this.partenza.mezzoComposizione));
    }

    _iconaStatiClass(statoMezzo: string): string {
        return iconaStatiClass(statoMezzo);
    }

    _checkSquadraOccupata(squadreComposizione: SquadraComposizione[]): boolean {
        return checkSquadraOccupata(squadreComposizione);
    }

    onHoverIn(): void {
        if (this.compPartenzaMode === Composizione.Veloce) {
            this.hoverIn.emit({
                idBoxPartenza: this.partenza.id,
                idMezzo: this.partenza.mezzoComposizione.mezzo.codice
            });
        }
    }

    onHoverOut(): void {
        if (this.compPartenzaMode === Composizione.Veloce) {
            this.hoverOut.emit();
        }
    }

}
