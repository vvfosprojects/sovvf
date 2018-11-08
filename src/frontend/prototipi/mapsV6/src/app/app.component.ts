import { Component } from '@angular/core';
import { UnitaAttualeService } from './navbar/navbar-service/unita-attuale/unita-attuale.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'mapsV6';

    constructor(public fakeCambioSede: UnitaAttualeService) {
    }
}
