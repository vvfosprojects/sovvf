import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*
    Modules
 */
import { PipeModule } from '../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { SintesiRichiestaModule } from '../richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
/*
    Component
  */
import { ComposizionePartenzaComponent } from './composizione-partenza.component';
import { BrowserModule } from '@angular/platform-browser';
import { NavComponent } from './composizione-veloce/nav/nav.component';
import { SlowerComponent } from './composizione-avanzata/slower.component';
import { FasterComponent } from './composizione-veloce/faster.component';
/*
    Provider
 */
import { DispatcherService } from '../core/dispatcher/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from '../core/dispatcher/dispatcher-lista-richieste-fake.service';
import { ListaRichiesteManagerService } from '../core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from '../core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { SintesiRichiesteService } from '../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from '../core/service/lista-richieste-service/lista-richieste.service.fake';
import { DispatcherCompPartenzaService } from '../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { DispatcherCompPartenzaFakeService } from '../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.fake.service';
import { CompPartenzaManagerService } from '../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompPartenzaManagerServiceFake } from '../core/manager/comp-partenza-manager/comp-partenza-manager.service.fake';
import { CompPartenzaService } from '../core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from '../core/service/comp-partenza-service/comp-partenza.service.fake';

@NgModule({
  declarations: [
    ComposizionePartenzaComponent,
    FasterComponent,
    SlowerComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule.forRoot(),
    PipeModule.forRoot(),
    SharedModule.forRoot(),
    TimeagoModule.forRoot({
        intl: TimeagoIntl,
        formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
    }),
    SintesiRichiestaModule
  ],
  exports: [
    ComposizionePartenzaComponent
  ],
  providers: [
    { provide: DispatcherService, useClass: DispatcherFakeService },
    { provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceFake },
    { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake },
    
    { provide: DispatcherCompPartenzaService, useClass: DispatcherCompPartenzaFakeService },
    { provide: CompPartenzaManagerService, useClass: CompPartenzaManagerServiceFake },
    { provide: CompPartenzaService, useClass: CompPartenzaServiceFake }
  ]
})
export class ComposizionePartenzaModule { }
