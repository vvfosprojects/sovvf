import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// Interface
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../interface/box-partenza-interface';
// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
// Ngxs
import { Store } from '@ngxs/store';
import { RequestResetBookMezzoComposizione } from '../../../store/actions/composizione-partenza/mezzi-composizione.actions';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
    @Input() mezzoComp: MezzoComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Input() partenze: BoxPartenza[];
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemPrenotato: boolean;
    @Input() itemInPrenotazione: boolean;
    @Input() itemBloccato: boolean;

    @Output() selezionato = new EventEmitter<MezzoComposizione>();
    @Output() deselezionato = new EventEmitter<MezzoComposizione>();
    @Output() hoverIn = new EventEmitter<MezzoComposizione>();
    @Output() hoverOut = new EventEmitter<MezzoComposizione>();
    @Output() sbloccato = new EventEmitter<MezzoComposizione>();

    // Progress Bar
    @Output() startTimeout = new EventEmitter<MezzoComposizione>();
    @Output() stopTimeout = new EventEmitter<MezzoComposizione>();

    // Mappa
    @Output() mezzoCoordinate = new EventEmitter<Coordinate>();

    constructor(private store: Store) {
    }

    ngOnInit() {
    }

    // Events
    onClick() {
        if (!this.itemSelezionato) {
            this.selezionato.emit(this.mezzoComp);

            // mappa
            this.mezzoDirection(this.mezzoComp);
        } else if (this.selezionato) {
            this.deselezionato.emit(this.mezzoComp);
        }
    }

    onHoverIn() {
        this.hoverIn.emit(this.mezzoComp);
    }

    onHoverOut() {
        this.hoverOut.emit(this.mezzoComp);
    }

    // Lucchetto
    onClickLucchetto() {
        // prevedere sblocco mezzo
    }

    // NgClass
    liClass() {
        let returnClass = '';

        const hover = this.itemHover ? 'hover-si' : 'hover-no';
        const selezionato = this.itemSelezionato ? 'selezionato-si' : 'selezionato-no';
        const prenotato = this.itemPrenotato ? 'prenotato-si' : 'prenotato-no';

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

        if (this.itemBloccato) {
            switch (this.mezzoComp.mezzo.stato) {
                case 'inViaggio':
                    returnClass += ' diagonal-stripes bg-lightinfo';
                    break;
                case 'sulPosto':
                    returnClass += ' diagonal-stripes bg-lightsuccess';
                    break;
            }
        }

        if (this.itemPrenotato) {
            returnClass += ' pb-0';
        }
        if (this.itemInPrenotazione) {
            returnClass += ' diagonal-stripes bg-lightgrey';
        }

        return returnClass;
    }

    statoMezzoClass() {
        return {
            'text-secondary': this.mezzoComp.mezzo.stato === 'inSede',
            'text-primary': this.mezzoComp.mezzo.stato === 'inRientro',
            'text-info': this.mezzoComp.mezzo.stato === 'inViaggio',
            'text-success': this.mezzoComp.mezzo.stato === 'sulPosto'
        };
    }

    badgeDistaccamentoClass() {
        let result = 'badge-secondary';

        if (this.richiesta && this.mezzoComp) {
            const distaccamentoMezzo = this.mezzoComp.mezzo.distaccamento.descrizione;

            if (this.richiesta.competenze) {
                if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
                    result = 'badge-primary';
                } else if (this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
                    result = 'badge-info';
                }
            }
        }
        return result;
    }

    // Mappa
    mezzoDirection(mezzoComp: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzoComp.coordinate);
    }

    onResetTimeout(e: MouseEvent) {
        e.stopPropagation();
        this.store.dispatch(new RequestResetBookMezzoComposizione(this.mezzoComp));
    }
}
