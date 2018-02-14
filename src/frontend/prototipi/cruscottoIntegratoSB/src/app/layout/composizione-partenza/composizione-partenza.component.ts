import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { DndHandlerService } from '../../../app/shared/modules/composizione-partenza-shared/compositore/dnd-handler.service';


@Component({
    selector: 'composizione-partenza-page',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.scss'],
    animations: [routerTransition()]
})
export class ComposizionePartenzaComponent implements OnInit {
    constructor(private dndHandlerService: DndHandlerService) { }

    ngOnInit() { }
}
