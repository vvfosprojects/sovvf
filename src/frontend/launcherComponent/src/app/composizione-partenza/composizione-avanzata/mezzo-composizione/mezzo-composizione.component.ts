import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Interface
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../interface/box-partenza-interface';

// Model
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

// Service
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit, OnChanges {
    @Input() mezzoComp: MezzoComposizione;
    @Output() selezionato = new EventEmitter<MezzoComposizione>();
    @Output() deselezionato = new EventEmitter<MezzoComposizione>();
    @Output() sbloccato = new EventEmitter<MezzoComposizione>();

    @Input() richiesta: SintesiRichiesta;
    @Input() partenzaCorrente: BoxPartenza;
    @Input() partenze: BoxPartenza[];

    lucchetto: boolean;

    // Progress Bar
    @Output() startTimeout = new EventEmitter<MezzoComposizione>();
    @Output() stopTimeout = new EventEmitter<MezzoComposizione>();
    @Input() lockInterval: any;
    @Input() progressBar: boolean;
    @Input() lockTimeout: number;

    // Mappa
    @Output() mezzoCoordinate = new EventEmitter<Coordinate>();

    constructor(private toastr: ToastrService) {
    }

    ngOnInit() {
        this.setLucchetto();
    }

    ngOnChanges() {
        this.setLucchetto();
    }

    // Mezzo
    onClick() {
        if (!this.mezzoComp.selezionato) {
            this.selezionato.emit(this.mezzoComp);

            // progressbar new
            this.startTimeout.emit(this.mezzoComp);

            // mappa
            this.mezzoDirection(this.mezzoComp);
        } else if (this.mezzoComp.selezionato) {
            this.deselezionato.emit(this.mezzoComp);

            // progressbar new
            this.stopTimeout.emit(this.mezzoComp);
        }
    }

    onHoverIn() {
        if (!this.mezzoComp.bloccato) {
            this.mezzoComp.hover = true;
        }
    }

    onHoverOut() {
        if (!this.mezzoComp.bloccato) {
            this.mezzoComp.hover = false;
        }
    }

    validateOnClick() {
        if (this.partenze.length > 0 && !this.lucchetto) {
            if (this.isBloccato(this.mezzoComp)) {
                this.showAlert('Attenzione!', 'Il mezzo selezionato è stato già assegnato ad una partenza', 'warning', 5000);
                // TEST
                // console.error('Mezzo bloccato da un\'altra partenza');
            } else if (this.isMezzoPartenzaBloccato(this.partenzaCorrente)) {
                this.sbloccaMezzoPartenza();
                this.onClick();
            } else {
                this.onClick();
            }
        } else if (!this.lucchetto) {
            this.onClick();
        } else if (this.lucchetto) {
            this.showAlert('Attenzione!', 'Il mezzo selezionato è già assegnato ad un intervento', 'error', 5000);
        }
    }

    isBloccato(mezzo: MezzoComposizione): boolean {
        let returnBool = false;

        /* se almeno una partenza ha il mezzo === mezzoComposizione, ed è bloccato, ritorna true */
        this.partenze.forEach(p => {
            if (p.mezzoComposizione && p.mezzoComposizione.bloccato && mezzo === p.mezzoComposizione) {
                returnBool = true;
            }
        });

        return returnBool;
    }

    isMezzoPartenzaBloccato(partenza: BoxPartenza): boolean {
        let returnBool = false;

        if (partenza.mezzoComposizione && partenza.mezzoComposizione.bloccato) {
            returnBool = true;
        }

        return returnBool;
    }

    sbloccaMezzoPartenza() {
        if (this.partenzaCorrente.mezzoComposizione) {
            const mezzo = this.partenzaCorrente.mezzoComposizione;
            mezzo.bloccato = false;
            this.sbloccato.emit(mezzo);
            // TEST
            // console.log('Sblocco il mezzo dalla partenza perchè ne ho selezionato un altro');
        }
    }

    // Lucchetto
    onClickLucchetto() {
        // prevedere sblocco mezzo
    }

    setLucchetto() {
        switch (this.mezzoComp.mezzo.stato) {
            case 'sulPosto':
                this.lucchetto = true;
                break;
            case 'inViaggio':
                this.lucchetto = true;
                break;
            default:
                this.lucchetto = false;
                break;
        }
    }

    // NgClass
    liClass() {
        let returnClass = '';

        const hover = this.mezzoComp.hover ? 'hover-si' : 'hover-no';
        const selezionato = this.mezzoComp.selezionato ? 'selezionato-si' : 'selezionato-no';
        const bloccato = this.mezzoComp.bloccato ? 'bloccato-si' : 'bloccato-no';

        switch (hover + '|' + selezionato + '|' + bloccato) {
            case 'hover-si|selezionato-no|bloccato-no':
                returnClass += 'border-warning';
                break;
            case 'hover-no|selezionato-si|bloccato-no':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si|bloccato-no':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-no|selezionato-no|bloccato-si':
                returnClass += 'diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-no|bloccato-si':
                returnClass += 'diagonal-stripes bg-lightgrey';
                break;
            case 'hover-no|selezionato-si|bloccato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si|bloccato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
        }

        if (this.lucchetto) {
            returnClass += '  diagonal-stripes bg-lightgrey';
        }

        if (this.mezzoComp.timeout) {
            returnClass += '  pb-0';
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

            if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
                result = 'badge-primary';
            } else if (this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
                result = 'badge-info';
            }
        }

        return result;
    }

    // Alert
    showAlert(title: string, message: string, type: any, duration: number) {
        this.toastr[type](message, title, {
            timeOut: duration
        });
    }

    // Mappa
    mezzoDirection(mezzoComp: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzoComp.coordinate);
    }
}
