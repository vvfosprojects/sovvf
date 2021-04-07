import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-tasto-chiamata-group',
    templateUrl: './tasti-telefonata-group.component.html',
    styleUrls: ['./tasti-telefonata-group.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TastiTelefonataGroupComponent {

    constructor() {
    }

}
