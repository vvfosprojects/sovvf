import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Model
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../interface/box-partenza-interface';
import { Coordinate } from 'src/app/shared/model/coordinate.model';

// Service

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

    @Input() partenzaCorrente: BoxPartenza;
    @Input() partenze: BoxPartenza[];

    // Mappa
    @Output() mezzoCoordinate = new EventEmitter<Coordinate>();

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
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
        if (this.partenze.length > 0) {
            if (this.isBloccato(this.mezzoComp)) {
                console.error('Mezzo bloccato da un\'altra partenza');
            } else if (this.isMezzoPartenzaBloccato(this.partenzaCorrente)) {
                console.error('Mezzo bloccato da un\'altra partenza');
            } else {
                this.onClick();
            }
        } else {
            this.onClick();
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


    onClick() {
        // console.log('clicco uno sbloccato');
        if (!this.mezzoComp.selezionato) {
            // console.log('clicco un deselezionato (sbloccato)');
            this.mezzoComp.selezionato = true;
            this.selezionato.emit(this.mezzoComp);

            // mappa
            this.mezzoDirection(this.mezzoComp);
        } else if (this.mezzoComp.selezionato) {
            // console.log('clicco un selezionato (sbloccato)');
            this.mezzoComp.selezionato = false;
            this.deselezionato.emit(this.mezzoComp);
        }
    }

    onClickLucchetto() {
        // console.log('clicco un bloccato');
        this.mezzoComp.bloccato = false;
        this.sbloccato.emit(this.mezzoComp);
        // TOAST ("IL MEZZO è BLOCCATO, SBLOCCALO")
    }

    liClass() {
        return {
            'border-warning': this.mezzoComp.hover && !this.mezzoComp.selezionato,
            'border-danger bg-light': this.mezzoComp.selezionato,
            'diagonal-stripes bg-lightgrey': this.mezzoComp.bloccato
        };
    }

    statoMezzoClass() {
        return {
            'text-secondary': this.mezzoComp.mezzo.stato === 'inSede',
            'text-primary': this.mezzoComp.mezzo.stato === 'inRientro',
            'text-info': this.mezzoComp.mezzo.stato === 'inViaggio',
            'text-success': this.mezzoComp.mezzo.stato === 'sulPosto'
        };
    }

    mezzoDirection(mezzoComp: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzoComp.coordinate);
    }
}
