import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-bottone-nuova-versione',
    templateUrl: './bottone-nuova-versione.component.html',
    styleUrls: ['./bottone-nuova-versione.component.scss']
})
export class BottoneNuovaVersioneComponent {

    @Input() btnBlock: boolean;
    @Input() icona = 'fa-refresh';
    @Input() testo = 'Nuova versione disponibile';
    @Input() tooltip = 'Clicca per ricaricare l\'applicazione all\'ultima versione disponibile!';

    @Output() doAction: EventEmitter<boolean> = new EventEmitter<boolean>();

    onClick(): void {
        this.doAction.emit(true);
    }
}
