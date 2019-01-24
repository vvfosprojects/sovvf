import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {EventiRichiestaComponent} from './eventi-richiesta.component';
import {EventoRichiestaComponent} from './evento-richiesta/evento-richiesta.component';
import {ListaEventiRichiestaComponent} from './lista-eventi-richiesta/lista-eventi-richiesta.component';
import {PipeModule} from '../../../shared/pipes/pipe.module';
import {SharedModule} from '../../../shared/shared.module';
import {EventiManagerService} from '../../../core/manager/eventi-richiesta-manager/eventi-manager-service.service';
import {EventiManagerServiceFake} from '../../../core/manager/eventi-richiesta-manager/eventi-manager-service.service.fake';
import {DispatcherEventiRichiestaService} from '../../../core/dispatcher/dispatcher-eventi/dispatcher-eventi-richiesta.service';
import {DispatcherEventiRichiestaServiceFake} from '../../../core/dispatcher/dispatcher-eventi/dispatcher-eventi-richiesta.service.fake';
import {EventiRichiestaService} from '../../../core/service/eventi-richiesta-service/eventi-richiesta.service';
import {EventiRichiestaServiceFake} from '../../../core/service/eventi-richiesta-service/eventi-richiesta.service.fake';


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
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
    ],
    entryComponents: [EventiRichiestaComponent],
    providers: [
        {provide: EventiManagerService, useClass: EventiManagerServiceFake},
        {provide: DispatcherEventiRichiestaService, useClass: DispatcherEventiRichiestaServiceFake},
        {provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake}
    ],
})
export class EventiRichiestaModule {
}
