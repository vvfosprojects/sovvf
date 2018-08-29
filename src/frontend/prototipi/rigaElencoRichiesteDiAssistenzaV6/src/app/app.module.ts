import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import * as Shared from './shared/';
import {AppComponent} from './app.component';
import {ListaRichiesteComponent} from './lista-richieste/lista-richieste.component';
import {SintesiRichiesteService} from './lista-richieste/sintesi-richieste-service/sintesi-richieste.service';
import {SintesiRichiesteServiceFake} from './lista-richieste/sintesi-richieste-service/sintesi-richieste.service.fake';
import {SintesiRichiestaComponent} from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import {FiltriComponent} from './lista-richieste/filtri/filtri.component';
import {FiltroComponent} from './lista-richieste/filtri/filtro/filtro.component';
import {RicercaRichiesteComponent} from './lista-richieste/ricerca-richieste/ricerca-richieste.component';

import {AgmCoreModule} from '@agm/core';
import {MapsComponent} from './maps/maps.component';
import {MapsService} from './maps/maps-service/maps-service.service';
import {MapsServiceFake} from './maps/maps-service/maps-service.service.fake';
import {googleApiKey} from './maps/apikey';
import {AnimationPipe} from './maps/maps-service/animation.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        FiltriComponent,
        FiltroComponent,
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
        MapsComponent,
        AnimationPipe,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: googleApiKey.apiKey
        }),
        FormsModule
    ],
    providers: [
        {provide: SintesiRichiesteService, useClass: SintesiRichiesteService},
        {provide: MapsService, useClass: MapsService},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
