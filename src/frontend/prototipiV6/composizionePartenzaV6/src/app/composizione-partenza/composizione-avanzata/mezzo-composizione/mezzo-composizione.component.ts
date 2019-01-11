import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Model
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../interface/box-partenza-interface';

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
    lucchetto = false;

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
        if (!this.partenzaCorrente) {
            this.onClick();
        } else if (this.partenzaCorrente && (!this.partenzaCorrente.mezzoComposizione || !this.partenzaCorrente.mezzoComposizione.bloccato)) {
            this.onClick();
        } else if (this.partenzaCorrente && this.partenzaCorrente.mezzoComposizione.bloccato) {
            console.error('Evento di output non emesso, prima sblocca il mezzo');
            console.log('PartenzaCorrente', this.partenzaCorrente);
        }
    }

    onClick(sbloccato = false) {
        if (!sbloccato) {
            if (!this.mezzoComp.selezionato) {
                this.mezzoComp.selezionato = true;
                this.selezionato.emit(this.mezzoComp);
            } else if (this.mezzoComp.selezionato) {
                this.mezzoComp.selezionato = false;
                this.deselezionato.emit(this.mezzoComp);
            }
        } else {
            this.sbloccato.emit(this.mezzoComp);
            // TOAST ("IL MEZZO è BLOCCATO, SBLOCCALO")
        }
    }

    liClass() {
        return {
            'border-warning bg-light': this.mezzoComp.hover,
            'border-danger bg-grey': this.mezzoComp.selezionato,
            'diagonal-stripes bg-lightgrey': this.mezzoComp.bloccato
        };
    }

    statoMezzoClass() {
        return {
            'text-secondary': this.mezzoComp.mezzo.stato === 'inSede'
        };
    }

    /* mezzoDirection(mezzoComp: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzoComp.coordinate);
    } */
}
