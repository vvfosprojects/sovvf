import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PipeModule } from './shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import * as Shared from './shared/';
import { MeteoService } from './shared/meteo/meteo-service.service';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
// start maps-container
import { AgmCoreModule } from '@agm/core';
import { AgmComponent } from './maps/agm/agm.component';
import { MapsService } from './maps/maps-service/maps-service.service';
import { MapsServiceFake } from './maps/maps-service/maps-service.service.fake';
import { MarkerService } from './maps/marker-service/marker-service.service';
import { MarkedService } from './maps/marked-service/marked-service.service';
import { AnimationPipe } from './maps/agm/agm-pipe/animation.pipe';
import { IconPipe } from './maps/agm/agm-pipe/icon.pipe';
import { NavComponent } from './maps/nav/nav.component';
import { MapsComponent } from './maps/maps.component';
// end maps-container
// start rigaElenco
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { SintesiRichiesteService } from './lista-richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service';
import { SintesiRichiesteServiceFake } from './lista-richieste/lista-richieste-service/sintesi-richieste-service/sintesi-richieste.service.fake';
import { SintesiRichiestaComponent } from './lista-richieste/sintesi-richiesta/sintesi-richiesta.component';
import { RicercaRichiesteComponent } from './lista-richieste/ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './lista-richieste/filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './lista-richieste/filtri-richieste/filtro/filtro.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
// end rigaElenco
// start boxes
import { BoxFunzionariComponent } from './boxes/info-aggregate/box-funzionari/box-funzionari.component';
import { InfoAggregateComponent } from './boxes/info-aggregate/info-aggregate.component';
import { InfoAggregateService } from './boxes/boxes-services/info-aggregate.service';
import { InfoAggregateServiceFake } from './boxes/boxes-services/info-aggregate.service.fake';
import { BoxInterventiComponent } from './boxes/info-aggregate/box-interventi/box-interventi.component';
import { BoxMezziComponent } from './boxes/info-aggregate/box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './boxes/info-aggregate/box-meteo/box-meteo.component';
// end boxes
// start sidebar
import { SidebarModule, Sidebar } from 'ng-sidebar';
// end sidebar


@NgModule({
    declarations: [
        AppComponent,
        ListaRichiesteComponent,
        SintesiRichiestaComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
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
        AgmComponent,
        AnimationPipe,
        IconPipe,
        NavComponent,
        MapsComponent,
        // end import maps
        BoxFunzionariComponent,
        InfoAggregateComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        PipeModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.apiUrl.maps.agm.key
        }),
        FormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        SidebarModule.forRoot()
    ],
    providers: [
        { provide: SintesiRichiesteService, useClass: SintesiRichiesteService },
        { provide: MapsService, useClass: MapsService },
        { provide: MarkerService, useClass: MarkerService },
        { provide: MarkedService, useClass: MarkedService },
        { provide: MeteoService, useClass: MeteoService },
        { provide: InfoAggregateService, useClass: InfoAggregateServiceFake }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
