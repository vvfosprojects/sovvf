import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { boxStatiClass } from '../../helper/function-composizione';

@Component({
    selector: 'app-icona-stato',
    templateUrl: './icona-stato.component.html',
    styleUrls: ['./icona-stato.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IconaStatoComponent {

    @Input() stato: any;

    constructor() {
    }

    _boxStatiClass(stato: string): string {
        return boxStatiClass(stato);
    }

}
