import { AppComponent } from './app.component';
import { I18n } from './i18n';
import { environment } from '../environments/environment';

/**
 * Module
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TimeagoModule, TimeagoFormatter, TimeagoCustomFormatter, TimeagoIntl } from 'ngx-timeago';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ToastrModule } from 'ngx-toastr';

/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { BoxesState, BoxClickState} from './features/home/boxes/store';
import { FiltriRichiesteState } from './features/home/filterbar/filtri-richieste/store';

/**
 * Route & Page
 */
import { routing } from './app.routing';
import { HomeComponent } from './features/home';
import { LoginComponent } from './features/login';
import { AutorimessaComponent } from './features/autorimessa';
import { StatisticheComponent } from './features/statistiche';
import { ServiziComponent } from './features/servizi';
import { NotFoundComponent } from './features/not-found';
import { JwtInterceptor, ErrorInterceptor } from './core/auth/_helpers';
import { fakeBackendProvider } from './core/auth/_helpers';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { RichiesteModule } from './features/home/richieste/richieste.module';
import { BoxesModule } from './features/home/boxes/boxes.module';
import { MapsModule } from './features/home/maps/maps.module';
import { EventiRichiestaModule } from './features/home/eventi/eventi-richiesta.module';
import { ChiamataModule } from './features/home/chiamata/chiamata.module';
import { FilterbarModule } from './features/home/filterbar/filterbar.module';
import { ComposizionePartenzaModule } from './features/home/composizione-partenza/composizione-partenza.module';
import { AppLoadModule } from './core/app-load/app-load.module';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        AutorimessaComponent,
        StatisticheComponent,
        ServiziComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppLoadModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgbModule,
        FormsModule,
        FilterPipeModule,
        NgProgressModule,
        NgProgressHttpModule,
        RichiesteModule,
        BoxesModule,
        MapsModule,
        SharedModule,
        EventiRichiestaModule,
        NavbarModule,
        ChiamataModule,
        FilterbarModule,
        ComposizionePartenzaModule,
        NgxWebstorageModule.forRoot(),
        PipeModule.forRoot(),
        SidebarModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        ToastrModule.forRoot({
            positionClass: 'toast-top-center',
            preventDuplicates: true,
        }),
        NgxsModule.forRoot(
            [BoxesState, BoxClickState, FiltriRichiesteState],
            { developmentMode: !environment.production }
        ),
        NgxsStoragePluginModule.forRoot({
            key: []
        }),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'Ngxs Boxes Store DevTools',
        }),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production,
        }),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        I18n,
        /**
         * provider fake per la login
         */
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
