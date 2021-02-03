import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-step-domande',
    templateUrl: './step-domande.component.html',
    styleUrls: ['./step-domande.component.scss']
})
export class StepDomandeComponent implements OnInit {

    @Input() domande: any[];
    @Input() codDomandaSelezionata: string;

    @Output() risposta: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit(): void {
    }

    setRisposta(codDomanda: string, risposta: any): void {
        this.risposta.emit({ codDomanda, risposta });
    }

}
