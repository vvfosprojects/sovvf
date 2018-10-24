import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from './shared/pipes/pipe.module';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {SidebarModule} from 'ng-sidebar';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';
/**
 * Route & Page
 */
import {routing} from './app.routing';
import {HomeComponent} from './auth/home';
import {LoginComponent} from './auth/login';
import {BasicAuthInterceptor, ErrorInterceptor} from './auth/_helpers';
import {fakeBackendProvider} from './auth/_helpers';
/**
 * Module Components
 */
import {BoxesModule} from './boxes/boxes.module';
import {MapsModule} from './maps/maps.module';
import {SharedModule} from './shared/shared.module';
/**
 * Richieste component da sistemare...
 */
import {RichiesteComponent} from './richieste/richieste.component';
import {ListaRichiesteComponent} from './richieste/lista-richieste/lista-richieste.component';
import {SintesiRichiestaComponent} from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import {RichiestaFissataComponent} from './richieste/lista-richieste/richiesta-fissata/richiesta-fissata.component';
import {RicercaRichiesteComponent} from './richieste/ricerca-richieste/ricerca-richieste.component';
import {FiltriRichiesteComponent} from './richieste/filtri-richieste/filtri-richieste.component';
import {FiltroComponent} from './richieste/filtri-richieste/filtro/filtro.component';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {ScrollEventModule} from 'ngx-scroll-event';
import {TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl} from 'ngx-timeago';
/**
 * eventi richieste component da sistemare...
 */
import {EventiRichiestaComponent} from './eventi-richiesta/eventi-richiesta.component';
import {EventoRichiestaComponent} from './eventi-richiesta/evento-richiesta/evento-richiesta.component';
import {ListaEventiRichiestaComponent} from './eventi-richiesta/lista-eventi-richiesta/lista-eventi-richiesta.component';
/**
 * import navbar
 */
import {NavbarComponent} from './navbar/navbar.component';
import {CambioSedeModalNavComponent} from './navbar/cambio-sede-modal-nav/cambio-sede-modal-nav.component';
/**
 * Fake Service
 */
import {RichiesteService} from './dispatcher/data/service/lista-richieste-service/richieste.service';
import {RichiesteServiceFake} from './dispatcher/data/service/lista-richieste-service/richieste.service.fake';
import {RichiesteMarkerService} from './dispatcher/data/service/maps-service/richieste-marker/richieste-marker.service';
import {RichiesteMarkerServiceFake} from './dispatcher/data/service/maps-service/richieste-marker/richieste-marker.service.fake';
import {SediMarkerService} from './dispatcher/data/service/maps-service/sedi-marker/sedi-marker.service';
import {SediMarkerServiceFake} from './dispatcher/data/service/maps-service/sedi-marker/sedi-marker.service.fake';
import {InfoAggregateService} from './dispatcher/data/service/boxes-service/info-aggregate.service';
import {InfoAggregateServiceFake} from './dispatcher/data/service/boxes-service/info-aggregate.service.fake';
import {MezziMarkerService} from './dispatcher/data/service/maps-service/mezzi-marker/mezzi-marker.service';
import {MezziMarkerServiceFake} from './dispatcher/data/service/maps-service/mezzi-marker/mezzi-marker.service.fake';


@NgModule({
    declarations: [
        AppComponent,
        /**
         * Richieste da spostare in un modulo...
         */
        RichiesteComponent,
        RichiestaFissataComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        /**
         * Eveni richiesta da spostare in un modulo...
         */
        EventiRichiestaComponent,
        EventoRichiestaComponent,
        ListaEventiRichiestaComponent,
        /**
         * Navbar
         */
        HomeComponent,
        LoginComponent,
        NavbarComponent,
        CambioSedeModalNavComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgbModule,
        PipeModule.forRoot(),
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        SidebarModule.forRoot(),
        ScrollEventModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        BoxesModule,
        MapsModule,
        SharedModule
    ],
    entryComponents: [CambioSedeModalNavComponent, EventiRichiestaComponent],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        /**
         * provider fake per la login
         */
        fakeBackendProvider,
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake},
        {provide: RichiesteService, useClass: RichiesteServiceFake},
        {provide: RichiesteMarkerService, useClass: RichiesteMarkerServiceFake},
        {provide: SediMarkerService, useClass: SediMarkerServiceFake},
        {provide: MezziMarkerService, useClass: MezziMarkerServiceFake}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
