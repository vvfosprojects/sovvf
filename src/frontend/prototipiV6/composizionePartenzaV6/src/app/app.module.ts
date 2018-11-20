import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComposizionePartenzaComponent } from './composizione-partenza/composizione-partenza.component';
import { FasterComponent } from './composizione-partenza/faster/faster.component';
import { SlowerComponent } from './composizione-partenza/slower/slower.component';
import { SintesiRichiestaComponent } from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
// Module
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { PipeModule } from './shared/pipes/pipe.module';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { DispatcherService } from './core/dispatcher/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from './core/dispatcher/dispatcher-lista-richieste-fake.service';
import { ListaRichiesteManagerService } from './core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from './core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { SintesiRichiesteService } from './core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from './core/service/lista-richieste-service/lista-richieste.service.fake';

@NgModule({
  declarations: [
    AppComponent,
    ComposizionePartenzaComponent,
    FasterComponent,
    SlowerComponent,
    SintesiRichiestaComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbModule.forRoot(),
    PipeModule.forRoot(),
    SharedModule.forRoot(),
    TimeagoModule.forRoot({
        intl: TimeagoIntl,
        formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
    })
  ],
  providers: [
    { provide: DispatcherService, useClass: DispatcherFakeService },
    { provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceFake },
    { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
