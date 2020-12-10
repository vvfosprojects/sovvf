import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-step-domande',
    templateUrl: './step-domande.component.html',
    styleUrls: ['./step-domande.component.scss']
})
export class StepDomandeComponent implements OnInit {

    @Input() domande: any[];
    @Input() stepDomanda: number;

    constructor() {
    }

    ngOnInit(): void {
    }

}
