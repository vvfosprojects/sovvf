import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ListaRichiesteComponent} from './lista-richieste/lista-richieste.component';
import {SintesiRichiesteService} from './lista-richieste/sintesi-richieste-service/sintesi-richieste.service';
import {SintesiRichiesteServiceFake} from './lista-richieste/sintesi-richieste-service/sintesi-richieste.service.fake';
import {SintesiRichiestaComponent} from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';

import {DebounceClickDirective} from './shared/directive/debounce-click';
import {DebounceKeyUpDirective} from './shared/directive/debounce-keyup';

import {ComponenteComponent} from './shared/components/componente/componente.component';
import {MezzoComponent} from './shared/components/mezzo/mezzo.component';
import {FiltriComponent} from './lista-richieste/filtri/filtri.component';
import {FiltroComponent} from './lista-richieste/filtri/filtro/filtro.component';
import {RicercaRichiesteComponent} from './lista-richieste/ricerca-richieste/ricerca-richieste.component';
import {CompetenzaComponent} from './shared/components/competenza/competenza.component';

import {AgmCoreModule} from '@agm/core';
import {MapsComponent} from './maps/maps.component';
import {MapsService} from './maps/maps-service/maps-service.service';
import {MapsServiceFake} from './maps/maps-service/maps-service.service.fake';
import {googleApiKey} from './maps/apikey';
import {AnimationPipe} from './maps/maps-service/animation.pipe';

@NgModule({
    declarations: [
        AppComponent,
        SintesiRichiestaComponent,
        ListaRichiesteComponent,
        ComponenteComponent,
        MezzoComponent,
        FiltriComponent,
        FiltroComponent,
        RicercaRichiesteComponent,
        CompetenzaComponent,
        DebounceClickDirective,
        DebounceKeyUpDirective,
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
        {provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake},
        {provide: MapsService, useClass: MapsService},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
