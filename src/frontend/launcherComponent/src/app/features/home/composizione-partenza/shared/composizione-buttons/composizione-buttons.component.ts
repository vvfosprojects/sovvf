import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-composizione-buttons',
    templateUrl: './composizione-buttons.component.html',
    styleUrls: ['./composizione-buttons.component.css']
})
export class ComposizioneButtonsComponent {

    @Input() boxPartenzaLenght: number;
    @Input() disableConfirmPartenza = true;
    @Input() disableConfirmPrenota = true;
    @Input() prenotato = false;
    @Output() confirmPartenza = new EventEmitter();
    @Output() confirmPrenota = new EventEmitter<boolean>();

    _confirmPartenza(): void {
        this.confirmPartenza.emit();
    }

    _confirmPrenota(): void {
        const value = !this.prenotato;
        this.confirmPrenota.emit(value);
    }

}
