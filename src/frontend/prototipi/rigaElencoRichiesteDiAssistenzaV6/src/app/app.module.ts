import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
    Modules
 */
import { PipeModule } from './shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ScrollEventModule } from 'ngx-scroll-event';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
import * as Shared from './shared/';
/*
    Components
 */
import { AppComponent } from './app.component';
import { RichiesteComponent } from './richieste/richieste.component';
import { ListaRichiesteComponent } from './richieste/lista-richieste/lista-richieste.component';
import { SintesiRichiestaComponent } from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { RicercaRichiesteComponent } from './richieste/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './richieste/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './richieste/filtri-richieste/filtro/filtro.component';
import { RichiestaFissataComponent } from './richieste/lista-richieste/richiesta-fissata/richiesta-fissata.component';
import { NavTestComponent } from './lista-richieste-test/nav-test/nav-test.component';
import { EventiRichiestaComponent } from './eventi-richiesta/eventi-richiesta.component';
/*
    Services
 */
import { SintesiRichiesteService } from './core/service/sintesi-richieste-service/sintesi-richieste.service';
import { SintesiRichiesteServiceFake } from './core/service/sintesi-richieste-service/sintesi-richieste.service.fake';
import { ListaRichiesteManagerService } from './core/manager/lista-richieste-manager/lista-richieste-manager.service';
import { ListaRichiesteManagerServiceFake } from './core/manager/lista-richieste-manager/lista-richieste-manager.service.fake';
import { DispatcherService } from './core/dispatcher/dispatcher-lista-richieste.service';
import { DispatcherFakeService } from './core/dispatcher/dispatcher-lista-richieste-fake.service';

@NgModule({
    declarations: [
        AppComponent,
        RichiesteComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        RichiestaFissataComponent,
        NavTestComponent,
        EventiRichiestaComponent,
        // start import of Shared Declarations
        [
            Shared.DebounceClickDirective,
            Shared.DebounceKeyUpDirective,
            Shared.CompetenzaComponent,
            Shared.ComponenteComponent,
            Shared.MezzoComponent],
        // end import of Shared Declarations
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgbModule,
        PipeModule.forRoot(),
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        ScrollEventModule,
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
export class AppModule {
}
