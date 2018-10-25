import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {EventiRichiestaComponent} from './eventi-richiesta.component';
import {EventoRichiestaComponent} from './evento-richiesta/evento-richiesta.component';
import {ListaEventiRichiestaComponent} from './lista-eventi-richiesta/lista-eventi-richiesta.component';
import {PipeModule} from '../shared/pipes/pipe.module';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot()
    ],
    declarations: [
        EventiRichiestaComponent,
        EventoRichiestaComponent,
        ListaEventiRichiestaComponent
    ],
    exports: [
        EventiRichiestaComponent
    ]
})
export class EventiRichiestaModule {
}
