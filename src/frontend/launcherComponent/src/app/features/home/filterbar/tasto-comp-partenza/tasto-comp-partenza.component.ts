import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-tasto-comp-partenza',
    templateUrl: './tasto-comp-partenza.component.html',
    styleUrls: ['./tasto-comp-partenza.component.css']
})
export class TastoCompPartenzaComponent {

    @Input() compPartenzaMode: string;
    @Output() cambioModalita = new EventEmitter();

    changeMode() {
        switch (this.compPartenzaMode) {
            case 'faster':
                this.compPartenzaMode = 'slower';
                break;
            case 'slower':
                this.compPartenzaMode = 'faster';
                break;
        }
        this.cambioModalita.emit(this.compPartenzaMode);
    }

}
