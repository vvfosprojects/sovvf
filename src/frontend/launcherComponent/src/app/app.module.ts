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
import { AppState } from './shared/store/states/app/app.state';
import { SignalRState } from './core/signalr/store/signalR.state';
import { ToastrState } from './shared/store/states/toastr/toastr.state';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
/**
 * Route
 */
import { APP_ROUTING } from './app.routing';
/**
 * Interceptor
 */
import { JwtInterceptor, ErrorInterceptor, LoaderInterceptor } from './core/interceptor';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { AppLoadModule } from './core/app-load/app-load.module';
import { RpcInterceptor } from './core/rpc/rpc-interceptor.service';
import { LoadingState } from './shared/store/states/loading/loading.state';
import { PaginationState } from './shared/store/states/pagination/pagination.state';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { PermessiState } from './shared/store/states/permessi/permessi.state';
import { RuoliUtenteLoggatoState } from './shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { NewVersionState } from './shared/store/states/nuova-versione/nuova-versione.state';
import { ViewportState } from './shared/store/states/viewport/viewport.state';
import { SignalROfflineComponent } from './core/signalr/signal-r-offline/signal-r-offline.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthState } from './features/auth/store/auth.state';


@NgModule({
    declarations: [
        AppComponent,
        SignalROfflineComponent,
        LoaderComponent,
        FooterComponent
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
            [ AuthState, AppState, NewVersionState, SignalRState,
                RuoliUtenteLoggatoState, PermessiState, ToastrState, SediTreeviewState,
                PaginationState, LoadingState, ViewportState ],
            { developmentMode: !environment.production }
        ),
        NgxsRouterPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            name: 'SO115 - NGXS',
            disabled: environment.production,
        }),
        NgxsFormPluginModule.forRoot()
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RpcInterceptor, multi: true },
        I18n,
    ],
    bootstrap: [ AppComponent ],
    entryComponents: [SignalROfflineComponent]
})

export class AppModule {
}
