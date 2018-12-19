import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ScrollEventModule } from 'ngx-scroll-event';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
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
import { ChiamataModule } from './chiamata/chiamata.module';
import { FilterbarModule } from './filterbar/filterbar.module';
import { I18n } from './i18n';
import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
    declarations: [
        AppComponent,
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
        FormsModule,
        FilterPipeModule,
        SidebarModule.forRoot(),
        ScrollEventModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: {provide: TimeagoFormatter, useClass: TimeagoCustomFormatter},
        }),
        ToastrModule.forRoot({
            positionClass: 'toast-top-center',
            preventDuplicates: true,
        }),
        RichiesteModule,
        BoxesModule,
        MapsModule,
        SharedModule,
        EventiRichiestaModule,
        NavbarModule,
        ChiamataModule,
        FilterbarModule,
        ComposizionePartenzaModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        I18n,
        /**
         * provider fake per la login
         */
        fakeBackendProvider,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
