import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PipeModule } from './shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
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


@NgModule({
    declarations: [
        AppComponent,
        RichiesteComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        // start import of Shared Declarations
        [
            Shared.DebounceClickDirective,
            Shared.DebounceKeyUpDirective,
            Shared.CompetenzaComponent,
            Shared.ComponenteComponent,
            Shared.MezzoComponent
        ],
        // end import of Shared Declarations
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        PipeModule.forRoot(),
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule
    ],
    providers: [
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
