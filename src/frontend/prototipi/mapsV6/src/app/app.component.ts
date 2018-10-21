import {Component} from '@angular/core';
import {UnitaOperativaService} from './navbar/navbar-service/unita-operativa-service/unita-operativa.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'mapsV6';

    constructor(public fakeCambioSede: UnitaOperativaService) {
    }
}
