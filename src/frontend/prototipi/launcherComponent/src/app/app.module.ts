import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import * as Shared from './shared/';
import {AppComponent} from './app.component';
// start maps-container
import {AgmCoreModule} from '@agm/core';
import {AgmComponent} from './maps-container/agm/agm.component';
import {MapsService} from './maps-container/agm/agm-service/maps-service.service';
import {MapsServiceFake} from './maps-container/agm/agm-service/maps-service.service.fake';
import {AnimationPipe} from './maps-container/agm/agm-service/animation.pipe';
import {NavComponent} from './maps-container/nav/nav.component';
import {MapsContainerComponent} from './maps-container/maps-container.component';
import {environment} from '../environments/environment';
// end maps-container
// start rigaElenco
import {ListaRichiesteComponent} from './lista-richieste/lista-richieste.component';
import {SintesiRichiesteService} from './lista-richieste/sintesi-richieste-service/sintesi-richieste.service';
import {SintesiRichiesteServiceFake} from './lista-richieste/sintesi-richieste-service/sintesi-richieste.service.fake';
import {SintesiRichiestaComponent} from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import {FiltriComponent} from './lista-richieste/filtri/filtri.component';
import {FiltroComponent} from './lista-richieste/filtri/filtro/filtro.component';
import {RicercaRichiesteComponent} from './lista-richieste/ricerca-richieste/ricerca-richieste.component';
// end rigaElenco
// start boxes
import {BoxFunzionariComponent} from './boxes/info-aggregate/box-funzionari/box-funzionari.component';
import {InfoAggregateComponent} from './boxes/info-aggregate/info-aggregate.component';
import {InfoAggregateService} from './boxes/boxes-services/info-aggregate.service';
import {BoxInterventiComponent} from './boxes/info-aggregate/box-interventi/box-interventi.component';
import {BoxMezziComponent} from './boxes/info-aggregate/box-mezzi/box-mezzi.component';
import {BoxMeteoComponent} from './boxes/info-aggregate/box-meteo/box-meteo.component';
import {BoxMeteoService} from './boxes/boxes-services/box-meteo-service.service';
// end boxes


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
        AgmComponent,
        AnimationPipe,
        NavComponent,
        MapsContainerComponent,
        BoxFunzionariComponent,
        InfoAggregateComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        FormsModule
    ],
    providers: [
        {provide: SintesiRichiesteService, useClass: SintesiRichiesteService},
        {provide: MapsService, useClass: MapsService},
        {provide: InfoAggregateService, useClass: InfoAggregateService},
        {provide: BoxMeteoService, useClass: BoxMeteoService}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
