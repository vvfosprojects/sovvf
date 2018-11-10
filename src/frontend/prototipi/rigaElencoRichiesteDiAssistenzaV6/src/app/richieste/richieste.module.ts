import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
/*
    Modules
 */
import { PipeModule } from '../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ScrollEventModule } from 'ngx-scroll-event';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
/*
    Components
 */
import { RichiesteComponent } from './richieste.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { SintesiRichiestaComponent } from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { SintesiRichiestaSmComponent } from './lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { RichiestaFissataComponent } from './lista-richieste/richiesta-fissata/richiesta-fissata.component';
/*
    Provider
 */
import { SintesiRichiesteService } from '../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from '../core/service/lista-richieste-service/lista-richieste.service.fake';
import { ListaRichiesteManagerService } from '../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from '../core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { DispatcherService } from '../core/dispatcher/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from '../core/dispatcher/dispatcher-lista-richieste-fake.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        NgxPaginationModule,
        BrowserAnimationsModule,
        ScrollEventModule,
        FilterPipeModule,
        NgbModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
        })
    ],
    declarations: [
        RichiesteComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RichiestaFissataComponent,
        SintesiRichiestaSmComponent
    ],
    exports: [
        RichiesteComponent
    ],
    providers: [
        { provide: DispatcherService, useClass: DispatcherFakeService },
        { provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceFake },
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake }
    ]
})
export class RichiesteModule { }
