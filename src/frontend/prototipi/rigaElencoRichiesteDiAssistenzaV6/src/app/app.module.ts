import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PipeModule } from './shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollEventModule } from 'ngx-scroll-event';
import * as Shared from './shared/';

import { AppComponent } from './app.component';
import { RichiesteComponent } from './richieste/richieste.component';
import { SintesiRichiesteService } from './richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import { SintesiRichiesteServiceFake } from './richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service.fake';
import { ListaRichiesteComponent } from './richieste/lista-richieste/lista-richieste.component';
import { SintesiRichiestaComponent } from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { RicercaRichiesteComponent } from './richieste/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './richieste/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './richieste/filtri-richieste/filtro/filtro.component';
import { RichiestaSelezionataComponent } from './richieste/lista-richieste/richiesta-selezionata/richiesta-selezionata.component';
import { NavTestComponent } from './richieste/lista-richieste-test/nav-test/nav-test.component';
import { EventiService } from './shared/eventi/eventi.service';
import { EventiServiceFake } from './eventi-fake/eventi.service.fake';


@NgModule({
    declarations: [
        AppComponent,
        RichiesteComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        RichiestaSelezionataComponent,
        NavTestComponent,
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
        ScrollEventModule
    ],
    providers: [
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake },
        { provide: EventiService, useClass: EventiServiceFake }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
