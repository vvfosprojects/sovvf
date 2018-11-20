import {Component, OnInit, Input} from '@angular/core';
import {BoxInterventi} from '../../boxes-model/box-interventi.model';

@Component({
    selector: 'app-box-interventi',
    templateUrl: './box-interventi.component.html',
    styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent implements OnInit {
    @Input() interventi: BoxInterventi;

    constructor() {
    }

    ngOnInit() {
    }
}
