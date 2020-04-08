import { Component, Input } from '@angular/core';
import { Meteo } from '../../../../../shared/model/meteo.model';

@Component({
    selector: 'app-box-meteo',
    templateUrl: './box-meteo.component.html',
    styleUrls: ['./box-meteo.component.css']
})
export class BoxMeteoComponent {

    @Input() datimeteo: Meteo;

}
