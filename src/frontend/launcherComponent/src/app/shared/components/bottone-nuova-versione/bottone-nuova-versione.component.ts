import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-bottone-nuova-versione',
    templateUrl: './bottone-nuova-versione.component.html',
    styleUrls: ['./bottone-nuova-versione.component.css']
})
export class BottoneNuovaVersioneComponent {

    @Output() getNewVersion: EventEmitter<boolean> = new EventEmitter<boolean>();

    onGetNewVersion() {
        this.getNewVersion.emit(true);
    }
}
