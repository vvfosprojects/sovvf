import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';

// Service

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
    @Input() mezzoComp: MezzoComposizione;
    @Output() selezionato = new EventEmitter<MezzoComposizione>();
    @Output() deselezionato = new EventEmitter<MezzoComposizione>();

    constructor() {
    }

    ngOnInit() {
    }

    onHoverIn() {
        this.mezzoComp.hover = true;
    }

    onHoverOut() {
        this.mezzoComp.hover = false;
    }

    onClick() {
        if (!this.mezzoComp.selezionato) {
            this.mezzoComp.selezionato = true;
            this.selezionato.emit(this.mezzoComp);
        } else {
            this.mezzoComp.selezionato = false;
            this.deselezionato.emit(this.mezzoComp);
        }
    }

    liClass() {
        return {
            'border-warning bg-light': this.mezzoComp.hover,
            'border-danger bg-grey': this.mezzoComp.selezionato
        };
    }

    /* mezzoDirection(mezzoComp: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzoComp.coordinate);
    } */
}
