import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import * as Shared from './shared/';
import {MeteoService} from './shared/meteo/meteo-service.service';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {routing} from './app.routing';
import {BasicAuthInterceptor, ErrorInterceptor} from './auth/_helpers';
import {HomeComponent} from './auth/home';
import {LoginComponent} from './auth/login';
// backend fake per login
import {fakeBackendProvider} from './auth/_helpers';
// start maps-container
import {MapsComponent} from './maps/maps.component';
import {MapsService} from './maps/service/maps-service/maps-service.service';
import {MapsServiceFake} from './maps/service/maps-service/maps-service.service.fake';
import {AgmComponent} from './maps/agm/agm.component';
import {AgmCoreModule} from '@agm/core';
// end maps-container
// start rigaElenco
import { RichiesteComponent } from './richieste/richieste.component';
import { SintesiRichiesteService } from './richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import { SintesiRichiesteServiceFake } from './richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service.fake';
import { ListaRichiesteComponent } from './richieste/lista-richieste/lista-richieste.component';
import { SintesiRichiestaComponent } from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { RicercaRichiesteComponent } from './richieste/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './richieste/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './richieste/filtri-richieste/filtro/filtro.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
// end rigaElenco
// start boxes
import {BoxFunzionariComponent} from './boxes/info-aggregate/box-funzionari/box-funzionari.component';
import {InfoAggregateComponent} from './boxes/info-aggregate/info-aggregate.component';
import {InfoAggregateService} from './boxes/boxes-services/info-aggregate.service';
import {InfoAggregateServiceFake} from './boxes/boxes-services/info-aggregate.service.fake';
import {BoxInterventiComponent} from './boxes/info-aggregate/box-interventi/box-interventi.component';
import {BoxMezziComponent} from './boxes/info-aggregate/box-mezzi/box-mezzi.component';
import {BoxMeteoComponent} from './boxes/info-aggregate/box-meteo/box-meteo.component';
// end boxes
// start sidebar
import {SidebarModule, Sidebar} from 'ng-sidebar';
import {NavbarComponent} from './navbar/navbar.component';
// end sidebar
// start navbar
import { UnitaOperativeServiceFake } from './navbar/navbar-service/unita-operativa.service.fake';
// end navbar


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
        // start import maps
        MapsComponent,
        AgmComponent,
        // end import maps
        BoxFunzionariComponent,
        InfoAggregateComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent,
        NavbarComponent,
        HomeComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        SidebarModule.forRoot()
    ],
    providers: [
        {provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake},
        {provide: MapsService, useClass: MapsServiceFake},
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake},
        {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        // backend fake provider per login
        fakeBackendProvider,
        // Unità Operativa
        UnitaOperativeServiceFake
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
