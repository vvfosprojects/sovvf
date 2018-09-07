import {Component, OnInit, Input} from '@angular/core';
import {BoxMezzi} from '../../boxes-model/box-mezzi.model';

@Component({
    selector: 'app-box-mezzi',
    templateUrl: './box-mezzi.component.html',
    styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnInit {
    @Input() mezzi: BoxMezzi;

    constructor() {
    }

    ngOnInit() {
    }

    getTotal() {
        return Object.values(this.mezzi).reduce((a, b) => a + b, 0);
    }

}
