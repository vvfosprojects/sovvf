import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-composizione-confirm-button',
    templateUrl: './composizione-confirm-button.component.html',
    styleUrls: ['./composizione-confirm-button.component.css']
})
export class ComposizioneConfirmButtonComponent {

    @Input() boxPartenzaLenght: number;
    @Input() disableConfirmPartenza = true;

    @Output() confirmPartenzaInViaggio = new EventEmitter();
    @Output() confirmPartenzaInUscita = new EventEmitter();

    _confirmPartenzaInViaggio(): void {
        this.confirmPartenzaInViaggio.emit();
    }

    _confirmPartenzaInUscita(): void {
        this.confirmPartenzaInUscita.emit();
    }

}
