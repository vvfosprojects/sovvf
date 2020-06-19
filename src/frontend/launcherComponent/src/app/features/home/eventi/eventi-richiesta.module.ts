import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { EventiRichiestaComponent } from './eventi-richiesta.component';
import { EventoRichiestaComponent } from './lista-eventi-richiesta/evento-richiesta/evento-richiesta.component';
import { ListaEventiRichiestaComponent } from './lista-eventi-richiesta/lista-eventi-richiesta.component';
import { SharedModule } from '../../../shared/shared.module';
import { EventiRichiestaService } from '../../../core/service/eventi-richiesta-service/eventi-richiesta.service';
import { NgxsModule } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { FiltriEventiRichiestaComponent } from './filtri-eventi-richiesta/filtri-eventi-richiesta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        NgbModule,
        NgSelectModule,
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            EventiRichiestaState
        ])
    ],
    declarations: [
        EventiRichiestaComponent,
        EventoRichiestaComponent,
        ListaEventiRichiestaComponent,
        FiltriEventiRichiestaComponent
    ],
    exports: [
        EventiRichiestaComponent
    ],
    entryComponents: [EventiRichiestaComponent],
    providers: [
        EventiRichiestaService
    ],
})
export class EventiRichiestaModule {
}
