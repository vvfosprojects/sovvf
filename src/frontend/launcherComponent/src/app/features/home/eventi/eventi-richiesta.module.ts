import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { EventiRichiestaComponent } from './eventi-richiesta.component';
import { EventoRichiestaComponent } from './evento-richiesta/evento-richiesta.component';
import { ListaEventiRichiestaComponent } from './lista-eventi-richiesta/lista-eventi-richiesta.component';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { SharedModule } from '../../../shared/shared.module';
import { EventiRichiestaService } from '../../../core/service/eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from '../../../core/service/eventi-richiesta-service/eventi-richiesta.service.fake';
import { NgxsModule } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { environment } from '../../../../environments/environment';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            EventiRichiestaState
        ])
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
        environment.fakeProvider ? { provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake } : EventiRichiestaService

    ],
})
export class EventiRichiestaModule {
}
