import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ricerca-group',
    templateUrl: './ricerca-group.component.html',
    styleUrls: ['./ricerca-group.component.css']
})
export class RicercaGroupComponent {
    @Input() filtriSelezionati: boolean;
}
