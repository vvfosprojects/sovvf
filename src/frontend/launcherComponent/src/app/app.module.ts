import { AppComponent } from './app.component';
import { I18n } from './i18n';
import { environment } from '../environments/environment';

/**
 * Module
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { UtenteState } from './features/navbar/operatore/store/states/utente.state';
import { UtentiState } from './features/home/store/states/utenti/utenti.state';

/**
 * Route
 */
import { APP_ROUTING } from './app.routing';
import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './core/auth/_helpers';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { AppLoadModule } from './core/app-load/app-load.module';



@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppLoadModule,
        ReactiveFormsModule,
        HttpClientModule,
        APP_ROUTING,
        NgbModule,
        FormsModule,
        FilterPipeModule,
        NgProgressModule,
        NgProgressHttpModule,
        SharedModule,
        NavbarModule,
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
            [UtenteState, UtentiState],
            { developmentMode: !environment.production }
        ),
        NgxsStoragePluginModule.forRoot({
            key: []
        }),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'SO115 - NGXS',
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
