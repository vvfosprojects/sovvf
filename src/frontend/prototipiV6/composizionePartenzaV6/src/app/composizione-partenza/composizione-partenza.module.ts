import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*
    Module
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
import { SlowerComponent } from './composizione-avanzata/slower.component';
import { FasterComponent } from './composizione-veloce/faster.component';
import { BoxNuovaPartenzaComponent } from './box-nuova-partenza/box-nuova-partenza.component';
/*
    Provider
 */
import { DispatcherCompPartenzaService } from '../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { DispatcherCompPartenzaFakeService } from '../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.fake.service';
import { CompPartenzaManagerService } from '../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompPartenzaManagerServiceFake } from '../core/manager/comp-partenza-manager/comp-partenza-manager.service.fake';
import { CompPartenzaService } from '../core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from '../core/service/comp-partenza-service/comp-partenza.service.fake';
import { MezzoComposizioneComponent } from './composizione-avanzata/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './composizione-avanzata/squadra-composizione/squadra-composizione.component';

@NgModule({
  declarations: [
    ComposizionePartenzaComponent,
    FasterComponent,
    SlowerComponent,
    BoxNuovaPartenzaComponent,
    MezzoComposizioneComponent,
    SquadraComposizioneComponent
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
    { provide: DispatcherCompPartenzaService, useClass: DispatcherCompPartenzaFakeService },
    { provide: CompPartenzaManagerService, useClass: CompPartenzaManagerServiceFake },
    { provide: CompPartenzaService, useClass: CompPartenzaServiceFake }
  ]
})
export class ComposizionePartenzaModule { }
