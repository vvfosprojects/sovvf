import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import * as Shared from './shared/';
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
import {AgmContentComponent} from './maps/agm/agm-content.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {AgmCoreModule} from '@agm/core';
import {MapManagerService} from './maps/service/maps-manager/map-manager-service.service';
import {InfoWindowComponent} from './maps/maps-ui/info-window/info-window.component';
import {MapsFiltroComponent} from './maps/maps-filtro/maps-filtro.component';
import {MezzoModalContentComponent} from './maps/maps-ui/info-window/mezzo-modal-content/mezzo-modal-content.component';

// end maps-container
// start rigaElenco
import {RichiesteComponent} from './richieste/richieste.component';
import {SintesiRichiesteService} from './richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import {SintesiRichiesteServiceFake} from './richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service.fake';
import {ListaRichiesteComponent} from './richieste/lista-richieste/lista-richieste.component';
import {SintesiRichiestaComponent} from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import {RichiestaSelezionataComponent} from './richieste/lista-richieste/richiesta-selezionata/richiesta-selezionata.component';
import {NavTestComponent} from './richieste/lista-richieste-test/nav-test/nav-test.component';
import {RicercaRichiesteComponent} from './richieste/ricerca-richieste/ricerca-richieste.component';
import {FiltriRichiesteComponent} from './richieste/filtri-richieste/filtri-richieste.component';
import {FiltroComponent} from './richieste/filtri-richieste/filtro/filtro.component';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {ListaRichiesteManagerService} from './richieste/lista-richieste-service/lista-richieste-manager/lista-richieste-manager.service';
import {ScrollEventModule} from 'ngx-scroll-event';
// end rigaElenco
// start eventiRichiesta
import {EventiRichiestaComponent} from './eventi-richiesta/eventi-richiesta.component';
import {EventoRichiestaComponent} from './eventi-richiesta/evento-richiesta/evento-richiesta.component';
import {ListaEventiRichiestaComponent} from './eventi-richiesta/lista-eventi-richiesta/lista-eventi-richiesta.component';
// end eventiRichiesta
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
import {UnitaOperativaService} from './navbar/navbar-service/unita-operativa-service/unita-operativa.service';
// end navbar
// managers only launcher
import {MapManagerServiceOnlylauncher} from './dispatcher/map-manager-service-onlylauncher.service';
import {ListaRichiesteManagerServiceOnlylauncher} from './dispatcher/lista-richieste-manager-service-onlylauncher.service';
import {EventiRichiestaServiceFake} from './eventi-richiesta/eventi-richiesta-service/eventi-richiesta.service.fake';
import {EventiRichiestaService} from './eventi-richiesta/eventi-richiesta-service/eventi-richiesta.service';


@NgModule({
    declarations: [
        AppComponent,
        RichiesteComponent,
        RichiestaSelezionataComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        NavTestComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        // start import of eventi
        EventiRichiestaComponent,
        EventoRichiestaComponent,
        ListaEventiRichiestaComponent,
        // end import of eventi
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
        AgmContentComponent,
        MapsFiltroComponent,
        InfoWindowComponent,
        MezzoModalContentComponent,
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
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        AgmJsMarkerClustererModule,
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        SidebarModule.forRoot(),
        ScrollEventModule
    ],
    entryComponents: [MezzoModalContentComponent, EventiRichiestaComponent],
    providers: [
        {provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake},
        {provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake},
        {provide: MapsService, useClass: MapsServiceFake},
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake},
        {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        // backend fake provider per login
        fakeBackendProvider,
        // Unità Operativa
        UnitaOperativaService,
        // Managers launcher only
        {provide: MapManagerService, useClass: MapManagerServiceOnlylauncher},
        {provide: ListaRichiesteManagerService, useClass: ListaRichiesteManagerServiceOnlylauncher},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
