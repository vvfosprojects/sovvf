import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
/**
 * Route & Page
 */
import { routing } from './app.routing';
import { HomeComponent } from './auth/home';
import { LoginComponent } from './auth/login';
import { BasicAuthInterceptor, ErrorInterceptor } from './auth/_helpers';
import { fakeBackendProvider } from './auth/_helpers';
/**
 * Module Components
 */
import { SharedModule } from './shared/shared.module';
import { BoxesModule } from './boxes/boxes.module';
import { MapsModule } from './maps/maps.module';
import { EventiRichiestaModule } from './eventi/eventi-richiesta.module';
/**
 * Richieste component da sistemare...
 */
import { RichiesteComponent } from './richieste/richieste.component';
import { ListaRichiesteComponent } from './richieste/lista-richieste/lista-richieste.component';
import { SintesiRichiestaComponent } from './richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { SintesiRichiestaSmComponent } from './richieste/lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { RichiestaFissataComponent } from './richieste/lista-richieste/richiesta-fissata/richiesta-fissata.component';
import { RicercaRichiesteComponent } from './richieste/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './richieste/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './richieste/filtri-richieste/filtro/filtro.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollEventModule } from 'ngx-scroll-event';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
/**
 * import navbar
 */
import { NavbarComponent } from './navbar/navbar.component';
import { CambioSedeModalNavComponent } from './navbar/cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { TurnoComponent } from './navbar/turno/turno.component';

/**
 * Fake Service
 */
import { InfoAggregateService } from './core/service/boxes-service/info-aggregate.service';
import { InfoAggregateServiceFake } from './core/service/boxes-service/info-aggregate.service.fake';
import { RichiesteService } from './core/service/lista-richieste-service/lista-richieste.service';
import { RichiesteServiceFake } from './core/service/lista-richieste-service/lista-richieste.service.fake';
import { EventiRichiestaService } from './core/service/eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from './core/service/eventi-richiesta-service/eventi-richiesta.service.fake';
import { TurnoService } from './navbar/turno/turno.service';
import { TurnoServiceFake } from './navbar/turno/turno.service.fake';


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
        SintesiRichiestaSmComponent,
        /**
         * Navbar
         */
        HomeComponent,
        LoginComponent,
        NavbarComponent,
        CambioSedeModalNavComponent,
        TurnoComponent,
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
            formatter: {provide: TimeagoFormatter, useClass: TimeagoCustomFormatter},
        }),
        BoxesModule,
        MapsModule,
        SharedModule,
        EventiRichiestaModule
    ],
    entryComponents: [CambioSedeModalNavComponent],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        /**
         * provider fake per la login
         */
        fakeBackendProvider,
        /**
         * servizi provider componenti launcher
         */
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake},
        {provide: RichiesteService, useClass: RichiesteServiceFake},
        {provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake},
        {provide: TurnoService, useClass: TurnoServiceFake}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
