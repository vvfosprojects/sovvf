import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-bottone-nuova-versione',
    templateUrl: './bottone-nuova-versione.component.html',
    styleUrls: ['./bottone-nuova-versione.component.scss']
})
export class BottoneNuovaVersioneComponent {

    @Input() btnBlock: boolean;
    @Output() getNewVersion: EventEmitter<boolean> = new EventEmitter<boolean>();

    onGetNewVersion() {
        this.getNewVersion.emit(true);
    }
}
