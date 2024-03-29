import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'app-locked-concorrenza',
    templateUrl: './locked-concorrenza.component.html',
    styleUrls: ['./locked-concorrenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LockedConcorrenzaComponent {

    @Input() nominativoOperatore: string;

    constructor() {
    }

}
