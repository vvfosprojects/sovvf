import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxClickInterface } from '../box-service/box-click-interface';

@Component({
    selector: 'app-box-mezzi',
    templateUrl: './box-mezzi.component.html',
    styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent {

    @Input() mezzi: BoxMezzi;
    @Input() boxClick: BoxClickInterface;
    @Output() clickMezzi = new EventEmitter<string>();

}
