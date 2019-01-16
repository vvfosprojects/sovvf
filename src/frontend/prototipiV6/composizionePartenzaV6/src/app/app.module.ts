import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';
import { ToastrModule } from 'ngx-toastr';

// Service
import { DispatcherService } from './core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from './core/dispatcher/dispatcher-lista-richieste/dispatcher-lista-richieste-fake.service';
import { ListaRichiesteManagerService } from './core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from './core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { SintesiRichiesteService } from './core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from './core/service/lista-richieste-service/lista-richieste.service.fake';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComposizionePartenzaModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
  providers: [
    { provide: DispatcherService, useClass: DispatcherFakeService },
    { provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceFake },
    { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
