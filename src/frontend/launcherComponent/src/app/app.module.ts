import { I18n } from './i18n';
import { environment } from '../environments/environment';
/**
 * Component
 */
import { AppComponent } from './app.component';
/**
 * Module
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
/**
 * State
 */
import { UtenteState } from './features/navbar/store/states/operatore/utente.state';
import { AppState } from './shared/store/states/app/app.state';
import { SignalRState } from './core/signalr/store/signalR.state';
import { ToastrState } from './shared/store/states/toastr/toastr.state';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
/**
 * Service
 */
import { NavbarService } from './core/service/navbar-service/navbar.service';
import { NavbarServiceFake } from './core/service/navbar-service/navbar.service.fake';
/**
 * Route
 */
import { APP_ROUTING } from './app.routing';
/**
 * Interceptor
 */
import { JwtInterceptor, ErrorInterceptor, FakeBackendInterceptor } from './core/_helpers';
import { SignalRInterceptor } from './core/signalr/signalR.interceptor';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { AppLoadModule } from './core/app-load/app-load.module';
import { RpcInterceptor } from './core/rpc/rpc-interceptor.service';
import { LoaderInterceptor } from './core/_helpers/loader.interceptor';
import { LoadingState } from './shared/store/states/loading/loading.state';
import { PaginationState } from './shared/store/states/pagination/pagination.state';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { UserService } from './core/auth/_services';
import { UserServiceFake } from './core/auth/_services/user.service.fake';
import { PermessiState } from './shared/store/states/permessi/permessi.state';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { RuoliUtenteLoggatoState } from './shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';


@NgModule({
    declarations: [
        AppComponent
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
        SidebarModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
        }),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-center',
            preventDuplicates: true,
        }),
        NgxsModule.forRoot(
            [AppState, UtenteState, SignalRState, RuoliUtenteLoggatoState, PermessiState, ToastrState, SediTreeviewState, PaginationState, LoadingState],
            { developmentMode: !environment.production }
        ),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'SO115 - NGXS',
            disabled: environment.production,
        }),
        NgxsFormPluginModule.forRoot(),
        NgxsResetPluginModule.forRoot()
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SignalRInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RpcInterceptor, multi: true },
        environment.fakeProvider ? { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true } : [],
        I18n,
        { provide: NavbarService, useClass: environment.fakeProvider ? NavbarServiceFake : NavbarService },
        { provide: UserService, useClass: UserServiceFake }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
