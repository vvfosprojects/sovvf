import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterbarComponent } from './filterbar.component';
import { ViewModeComponent } from './view-mode/view-mode.component';
import { FiltriMappaComponent } from './filtri-mappa/filtri-mappa.component';
import { TastoChiamataComponent } from './tasto-chiamata/tasto-chiamata.component';
import { MarkerMeteoSwitchComponent } from './marker-meteo-switch/marker-meteo-switch.component';
import { RicercaRichiesteComponent } from './ricerca-richieste/ricerca-richieste.component';
import { FiltriRichiesteComponent } from './filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './filtri-richieste/filtro/filtro.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LoaderMarkerComponent } from './loader-marker/loader-marker.component';
import { TastoSchedeContattoComponent } from './tasto-schede-contatto/tasto-schede-contatto.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FilterPipeModule,
        NgxPaginationModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        UiSwitchModule.forRoot(null)
    ],
    declarations: [
        FilterbarComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        ViewModeComponent,
        FiltriMappaComponent,
        TastoChiamataComponent,
        MarkerMeteoSwitchComponent,
        LoaderMarkerComponent,
        TastoSchedeContattoComponent
    ],
    exports: [
        FilterbarComponent
    ]
})
export class FilterbarModule {
}
