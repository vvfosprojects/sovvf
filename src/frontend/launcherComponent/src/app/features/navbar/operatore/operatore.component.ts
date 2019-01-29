import { Component, Input } from '@angular/core';
import { User } from '../../../core/auth/_models';

@Component({
    selector: 'app-operatore',
    templateUrl: './operatore.component.html',
    styleUrls: ['./operatore.component.css']
})
export class OperatoreComponent {

    @Input() user: User[];

}
