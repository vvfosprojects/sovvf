import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FiltroMezzi } from '../../../maps-model/filtro-mezzi.interface';
import { StatoMezzo } from '../../../../../../shared/enum/stato-mezzo.enum';

@Component({
    selector: 'app-filtri-markers-mezzi',
    templateUrl: './filtri-markers-mezzi.component.html',
    styleUrls: ['./filtri-markers-mezzi.component.css']
})
export class FiltriMarkersMezziComponent implements OnInit {

    @Input() filtroMezzi: FiltroMezzi;

    @Output() changeStati: EventEmitter<any> = new EventEmitter<any>();
    @Output() changeTipologie: EventEmitter<any> = new EventEmitter<any>();

    statiMezzo = Object.values(StatoMezzo);
    tipologieMezzo = ['APS', 'ABP', 'AS'];
    // TODO: terminare

    constructor() {
    }

    ngOnInit() {
    }

}
