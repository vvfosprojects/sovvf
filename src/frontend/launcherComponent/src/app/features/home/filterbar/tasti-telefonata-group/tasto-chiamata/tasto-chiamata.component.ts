import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
    selector: 'app-tasto-chiamata',
    templateUrl: './tasto-chiamata.component.html',
    styleUrls: ['./tasto-chiamata.component.css']
})
export class TastoChiamataComponent {

    @HostBinding('class') classes = 'btn-group';

    @Input() colorButtonChiamata = 'btn-outline-success';
    @Output() startChiamata = new EventEmitter();

    chiamata() {
        const bool = this.colorButtonChiamata === 'btn-outline-success';
        if (bool) {
            this.startChiamata.emit();
        }
    }

}
