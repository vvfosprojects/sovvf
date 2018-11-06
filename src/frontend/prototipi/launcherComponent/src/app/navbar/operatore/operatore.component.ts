import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent implements OnInit {

    @Input() user: any;

    constructor() {
    }

    ngOnInit() {
    }

}
