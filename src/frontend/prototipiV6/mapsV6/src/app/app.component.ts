import { Component } from '@angular/core';
import { ViewInterfaceMaps } from './shared/interface/view.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    /**
     * parametri iniziali solo per componente Prototipo
     */
    viewStateMappa: ViewInterfaceMaps = {
        active: 'normale'
    };
    fakeCambioSede = {
        preLoader: true
    };

}
