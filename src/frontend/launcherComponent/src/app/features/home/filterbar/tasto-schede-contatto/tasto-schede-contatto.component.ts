import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ContatoriSchedeContatto } from '../../../../shared/interface/contatori-schede-contatto.interface';

@Component({
    selector: 'app-tasto-schede-contatto',
    templateUrl: './tasto-schede-contatto.component.html',
    styleUrls: ['./tasto-schede-contatto.component.css']
})
export class TastoSchedeContattoComponent {

    @Input() active: boolean;
    @Input() disabled: boolean;
    @Input() contatoriSchedeContatto: ContatoriSchedeContatto;

    @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class') classes = 'btn-group';

    constructor() {
    }

    coloreTasto(): string {
        if (this.active) {
            return 'btn-light btn-nav-selected';
        } else if (!this.active) {
            return 'btn-outline-secondary';
        }

        if (this.disabled) {
            return 'cursor-not-allowed';
        }
        return '';
    }

    coloreBadgeContatore(): string {
        let returnClass = 'badge-success';
        if (this.active) {
            returnClass = 'badge-success';
        }
        return returnClass;
    }

    toggleSchedeContatto(): void {
        this.toggle.emit();
    }
}
