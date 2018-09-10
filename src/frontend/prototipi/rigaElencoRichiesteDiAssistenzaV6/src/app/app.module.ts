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
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { SintesiRichiesteService } from './lista-richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import { SintesiRichiesteServiceFake } from './lista-richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service.fake';
import { SintesiRichiestaComponent } from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { RicercaRichiesteComponent } from './lista-richieste/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './lista-richieste/filtri-richieste/filtri-richieste.component';


@NgModule({
    declarations: [
        AppComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RicercaRichiesteComponent,
        // start import of Shared Declarations
        [
            Shared.DebounceClickDirective,
            Shared.DebounceKeyUpDirective,
            Shared.CompetenzaComponent,
            Shared.ComponenteComponent,
            Shared.MezzoComponent
        ],
        // end import of Shared Declarations
        FiltriRichiesteComponent
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
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteService }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
