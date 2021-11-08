import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockComponent {

    @Input() time: Date;

}
