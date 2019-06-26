import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-composizione-buttons',
    templateUrl: './composizione-buttons.component.html',
    styleUrls: ['./composizione-buttons.component.css']
})
export class ComposizioneButtonsComponent implements OnInit {

    @Input() boxPartenzaLenght: number;
    @Input() disableConfirmPartenza = true;
    @Input() disableConfirmPrenota = true;
    @Output() confirmPartenza = new EventEmitter();
    @Output() confirmPrenota = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    _confirmPartenza(): void {
        this.confirmPartenza.emit();
    }

    _confirmPrenota(): void {
        this.confirmPrenota.emit();
    }

}
