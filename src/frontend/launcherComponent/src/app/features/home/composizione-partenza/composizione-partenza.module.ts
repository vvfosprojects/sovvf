import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*
    Module
 */
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { SintesiRichiestaModule } from '../richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
import { NgSelectModule } from '@ng-select/ng-select';
/*
    Component
  */
import { ComposizionePartenzaComponent } from './composizione-partenza.component';
import { BrowserModule } from '@angular/platform-browser';
import { ComposizioneAvanzataComponent } from './composizione-avanzata/composizione-avanzata.component';
import { FasterComponent } from './composizione-veloce/composizione-veloce.component';
import { BoxNuovaPartenzaComponent } from './shared/box-nuova-partenza/box-nuova-partenza.component';
import { MezzoComposizioneComponent } from './composizione-avanzata/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './composizione-avanzata/squadra-composizione/squadra-composizione.component';
import { ComposizioneFilterbarComponent } from './shared/filterbar/composizione-filterbar.component';
/*
    Provider
 */
import { DispatcherCompPartenzaService } from '../../../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.service';
import { DispatcherCompPartenzaFakeService } from '../../../core/dispatcher/dispatcher-comp-partenza/dispatcher-comp-partenza.fake.service';
import { CompPartenzaManagerService } from '../../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompPartenzaManagerServiceFake } from '../../../core/manager/comp-partenza-manager/comp-partenza-manager.service.fake';
import { CompPartenzaService } from '../../../core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from '../../../core/service/comp-partenza-service/comp-partenza.service.fake';

@NgModule({
  declarations: [
    ComposizionePartenzaComponent,
    FasterComponent,
    ComposizioneAvanzataComponent,
    BoxNuovaPartenzaComponent,
    MezzoComposizioneComponent,
    SquadraComposizioneComponent,
    ComposizioneFilterbarComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    PipeModule.forRoot(),
    SharedModule.forRoot(),
    TimeagoModule.forRoot({
      intl: TimeagoIntl,
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
    }),
    NgSelectModule,
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
