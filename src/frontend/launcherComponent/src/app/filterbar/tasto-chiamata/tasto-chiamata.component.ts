import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-tasto-chiamata',
    templateUrl: './tasto-chiamata.component.html',
    styleUrls: ['./tasto-chiamata.component.css']
})
export class TastoChiamataComponent {

    @Input() colorButtonChiamata = 'btn-outline-success';
    @Output() startChiamata = new EventEmitter();

    chiamata() {
        this.startChiamata.emit();
    }

}
