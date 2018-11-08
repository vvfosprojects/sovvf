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
import { NavbarModule } from './navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { RichiesteModule } from './richieste/richieste.module';
import { BoxesModule } from './boxes/boxes.module';
import { MapsModule } from './maps/maps.module';
import { EventiRichiestaModule } from './eventi/eventi-richiesta.module';
/**
 * Richieste component da sistemare...
 */
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ScrollEventModule } from 'ngx-scroll-event';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
/**
 * Chiamata Component
 */
import { NgSelectModule } from '@ng-select/ng-select';
/**
 * Fake Service
 */
import { EventiRichiestaService } from './core/service/eventi-richiesta-service/eventi-richiesta.service';
import { EventiRichiestaServiceFake } from './core/service/eventi-richiesta-service/eventi-richiesta.service.fake';
import { ChiamataComponent } from './chiamata/chiamata.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ChiamataComponent,
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
        FilterPipeModule,
        SidebarModule.forRoot(),
        ScrollEventModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: {provide: TimeagoFormatter, useClass: TimeagoCustomFormatter},
        }),
        RichiesteModule,
        BoxesModule,
        MapsModule,
        SharedModule,
        EventiRichiestaModule,
        NavbarModule,
        NgSelectModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        /**
         * provider fake per la login
         */
        fakeBackendProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
