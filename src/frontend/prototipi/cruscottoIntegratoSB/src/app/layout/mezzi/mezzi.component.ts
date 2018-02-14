import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-mezzi',
    templateUrl: './mezzi.component.html',
    styleUrls: ['./mezzi.component.scss'],
    animations: [routerTransition()]
})
export class MezziComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
