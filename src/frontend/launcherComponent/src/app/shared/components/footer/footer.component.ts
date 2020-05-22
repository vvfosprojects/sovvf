import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: [ './footer.component.scss' ]
})
export class FooterComponent {

    @Input() version = 'devel';
    isTest: string;

    constructor() {
        this.isTest = environment.productionTest ? ' (ATTENZIONE QUESTA E\' UNA VERSIONE DI TEST) ' : '';
    }

}
