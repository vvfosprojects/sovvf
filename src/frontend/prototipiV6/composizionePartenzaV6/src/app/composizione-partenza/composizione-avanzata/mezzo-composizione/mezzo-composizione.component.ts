import { Component, OnInit, Input } from '@angular/core';

// Model
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';

// Service
import { ComposizioneAvanzataService } from '../../service/composizione-avanzata/composizione-avanzata.service';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
    @Input() mezzo: MezzoComposizione;

    constructor(private composizioneService: ComposizioneAvanzataService) {
    }

    ngOnInit() {
    }

    onHoverIn() {
        this.mezzo.hover = true;
    }

    onHoverOut() {
        this.mezzo.hover = false;
    }

    onClick() {
      this.mezzo.selezionato = !this.mezzo.selezionato;
    }

    liClass() {
        return {
            'border-warning bg-light': this.mezzo.hover,
            'border-danger bg-grey': this.mezzo.selezionato
        };
    }

    /* mezzoDirection(mezzo: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzo.coordinate);
    } */
}
