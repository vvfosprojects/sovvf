import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterbarComponent } from './filterbar.component';
import { RicercaRichiesteComponent } from './ricerca-richieste/ricerca-richieste.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { SharedModule } from '../../../shared/shared.module';
import { FiltriRichiesteComponent } from './filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from './filtri-richieste/filtro/filtro.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewModeComponent } from './view-mode/view-mode.component';
import { FiltriMappaComponent } from './filtri-mappa/filtri-mappa.component';
import { TastoChiamataComponent } from './tasto-chiamata/tasto-chiamata.component';
import { TastoCompPartenzaComponent } from './tasto-comp-partenza/tasto-comp-partenza.component';
import { MarkerMeteoSwitchComponent } from './marker-meteo-switch/marker-meteo-switch.component';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        FilterPipeModule,
        NgxPaginationModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        UiSwitchModule
    ],
    declarations: [
        FilterbarComponent,
        RicercaRichiesteComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        ViewModeComponent,
        FiltriMappaComponent,
        TastoChiamataComponent,
        TastoCompPartenzaComponent,
        MarkerMeteoSwitchComponent,
    ],
    exports: [
        FilterbarComponent
    ]
})
export class FilterbarModule {
}
