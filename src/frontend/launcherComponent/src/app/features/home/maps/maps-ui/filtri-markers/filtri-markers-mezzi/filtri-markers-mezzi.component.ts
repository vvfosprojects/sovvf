import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FiltroMezzi } from '../../../maps-model/filtro-mezzi.interface';
import { StatoMezzo } from '../../../../../../shared/enum/stato-mezzo.enum';

@Component({
    selector: 'app-filtri-markers-mezzi',
    templateUrl: './filtri-markers-mezzi.component.html',
    styleUrls: ['./filtri-markers-mezzi.component.css']
})
export class FiltriMarkersMezziComponent implements OnInit {

    @Input() filtroMezziAttivi: FiltroMezzi;
    @Input() statiMezzo = Object.values(StatoMezzo);
    @Input() genereMezzo: any;

    @Output() changeStati: EventEmitter<any> = new EventEmitter<any>();
    @Output() changeGenere: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
    }

}
