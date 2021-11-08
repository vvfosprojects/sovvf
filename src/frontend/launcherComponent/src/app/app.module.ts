import { environment } from '../environments/environment';
import { I18n } from './i18n';
/**
 * Component
 */
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SignalROfflineComponent } from './core/signalr/signal-r-offline/signal-r-offline.component';
/**
 * Module
 */
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SidebarModule } from 'ng-sidebar';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
/**
 * State
 */
import { AppState } from './shared/store/states/app/app.state';
import { SignalRState } from './core/signalr/store/signalR.state';
import { ToastrState } from './shared/store/states/toastr/toastr.state';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
import { SostituzionePartenzeFineTurnoModalState } from './shared/store/states/sostituzione-partenze-fine-turno-modal/sostituzione-partenze-fine-turno-modal.state';
import { SchedeContattoState } from './features/home/store/states/schede-contatto/schede-contatto.state';
import { MergeSchedeContattoState } from './features/home/store/states/schede-contatto/merge-schede-contatto.state';
import { TipologieState } from './shared/store/states/tipologie/tipologie.state';
import { DettagliTipologieState } from './shared/store/states/dettagli-tipologie/dettagli-tipologie.state';
import { TriageCrudState } from './shared/store/states/triage-crud/triage-crud.state';
import { TriageChiamataModalState } from './shared/store/states/triage-chiamata-modal/triage-chiamata-modal.state';
import { AuthState } from './features/auth/store/auth.state';
import { NotificheState } from './shared/store/states/notifiche/notifiche.state';
import { TrasferimentoChiamataModalState } from './shared/store/states/trasferimento-chiamata-modal/trasferimento-chiamata-modal.state';
import { EntiState } from './shared/store/states/enti/enti.state';
import { AllertaSedeModalState } from './shared/store/states/allerta-sede-modal/allerta-sede-modal.state';
import { ImpostazioniState } from './shared/store/states/impostazioni/impostazioni.state';
import { PaginationComposizionePartenzaState } from './shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { PermessiState } from './shared/store/states/permessi/permessi.state';
import { RuoliUtenteLoggatoState } from './shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { NewVersionState } from './shared/store/states/nuova-versione/nuova-versione.state';
import { ViewportState } from './shared/store/states/viewport/viewport.state';
import { LoadingState } from './shared/store/states/loading/loading.state';
import { PaginationState } from './shared/store/states/pagination/pagination.state';
import { TriageSummaryState } from './shared/store/states/triage-summary/triage-summary.state';
import { DistaccamentiState } from './shared/store/states/distaccamenti/distaccamenti.state';
import { PosModalState } from './shared/store/states/pos-modal/pos-modal.state';
import { DocumentoAreaDocumentaleState } from './shared/store/states/documento-area-documentale-modal/documento-area-documentale-modal.state';
import { FiltriAreaDocumentaleState } from './shared/store/states/filtri-area-documentale/filtri-area-documentale.state';
import { TastoChiamataMappaState } from './features/maps/store/states/tasto-chiamata-mappa.state';
import { SchedaTelefonataState } from './features/home/store/states/form-richiesta/scheda-telefonata.state';
import { TastoZonaEmergenzaMappaState } from './features/zone-emergenza/store/states/tasto-zona-emergenza-mappa/tasto-zona-emergenza-mappa.state';
/**
 * Route
 */
import { APP_ROUTING } from './app-routing.module';
/**
 * Interceptor
 */
import { ErrorInterceptor, JwtInterceptor, LoaderInterceptor } from './core/interceptor';
/**
 * Module Components
 */
import { NavbarModule } from './features/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { AppLoadModule } from './core/app-load/app-load.module';
/**
 * Provider
 */
import { RpcInterceptor } from './core/rpc/rpc-interceptor.service';
import { CustomDatepickerI18nService } from './core/service/custom-datepicker-i18n/custom-datepicker-i18n.service';

@NgModule({
    declarations: [
        AppComponent,
        SignalROfflineComponent,
        FooterComponent
    ],
    imports: [
        APP_ROUTING,
        BrowserModule,
        BrowserAnimationsModule,
        AppLoadModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        FilterPipeModule,
        NgProgressModule,
        NgProgressHttpModule,
        SharedModule,
        NavbarModule,
        SidebarModule,
        NgxUiLoaderModule.forRoot({}),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-center',
            preventDuplicates: true,
        }),
        NgxsModule.forRoot(
            [
                AuthState,
                AppState,
                NewVersionState,
                SignalRState,
                RuoliUtenteLoggatoState,
                PermessiState,
                ToastrState,
                SediTreeviewState,
                PaginationState,
                LoadingState,
                ViewportState,
                EntiState,
                TrasferimentoChiamataModalState,
                NotificheState,
                AllertaSedeModalState,
                ImpostazioniState,
                PaginationComposizionePartenzaState,
                SostituzionePartenzeFineTurnoModalState,
                SchedeContattoState,
                MergeSchedeContattoState,
                TipologieState,
                DettagliTipologieState,
                TriageCrudState,
                TriageChiamataModalState,
                TriageSummaryState,
                DistaccamentiState,
                PosModalState,
                DocumentoAreaDocumentaleState,
                SchedaTelefonataState,
                FiltriAreaDocumentaleState,
                TastoChiamataMappaState,
                TastoZonaEmergenzaMappaState
            ],
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
        I18n,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RpcInterceptor, multi: true },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18nService }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
