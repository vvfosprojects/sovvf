import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
/*
    Modules
 */
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';
/*
    Components
 */
import { RichiesteComponent } from './richieste.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { SintesiRichiestaSmComponent } from './lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { RichiestaFissataComponent } from './lista-richieste/richiesta-fissata/richiesta-fissata.component';
/*
    Provider
 */
import { SintesiRichiesteService } from '../../../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from '../../../core/service/lista-richieste-service/lista-richieste.service.fake';
import { ListaRichiesteManagerService } from '../../../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from '../../../core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { DispatcherService } from '../../../core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from '../../../core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste-fake.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SintesiRichiestaComponent } from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        ScrollingModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
        })
    ],
    declarations: [
        RichiesteComponent,
        ListaRichiesteComponent,
        RichiestaFissataComponent,
        SintesiRichiestaSmComponent,
        SintesiRichiestaComponent
    ],
    exports: [
        RichiesteComponent,
        SintesiRichiestaComponent
    ],
    providers: [
        { provide: DispatcherService, useClass: DispatcherFakeService },
        { provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceFake },
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake }
    ]
})
export class RichiesteModule { }
