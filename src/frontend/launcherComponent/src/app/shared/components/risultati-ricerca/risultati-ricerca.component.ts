import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-risultati-ricerca',
    templateUrl: './risultati-ricerca.component.html',
    styleUrls: ['./risultati-ricerca.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RisultatiRicercaComponent {

    @Input() ricerca: string;

    constructor() {
    }

}
