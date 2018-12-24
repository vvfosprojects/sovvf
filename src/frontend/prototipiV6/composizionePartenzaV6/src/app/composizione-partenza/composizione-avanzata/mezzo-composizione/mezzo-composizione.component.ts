import { Component, OnInit, Input } from '@angular/core';

// Model
import { MezzoComposizione } from '../../interface/composizione-partenza-interface';

// Service
import { CompMezzoSquadraService } from '../../service/comp-mezzo-squadra/comp-mezzo-squadra.service';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit {
    @Input() mezzoComp: MezzoComposizione;

    constructor(private compMezzoSquadra: CompMezzoSquadraService) {
    }

    ngOnInit() {
    }

    hoverIn() {
        // this.hover = true;
    }

    hoverOut() {
        // this.hover = false;
    }

    /* mezzoDirection(mezzo: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzo.coordinate);
    } */
}
