import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoxInterventi } from '../../boxes-model/box-interventi.model';
import { BoxClickInterface } from '../../box-interface/box-click-interface';

@Component({
    selector: 'app-box-interventi',
    templateUrl: './box-interventi.component.html',
    styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent {

    @Input() interventi: BoxInterventi;
    @Input() boxClick: BoxClickInterface;
    @Output() clickRichieste = new EventEmitter<string>();

}
